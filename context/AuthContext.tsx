
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Notification, LoginProvider } from '../types';
import { 
    auth, db, storage, 
    googleProvider, facebookProvider, twitterProvider, githubProvider,
    signInWithPopup, signOut, onAuthStateChanged,
    doc, setDoc, getDoc, collection, addDoc, updateDoc,
    ref, uploadBytes, getDownloadURL,
    OAuthProvider
} from '../src/lib/firebase'; // Use local shim
import { WalletSystem } from '../services/Economy/WalletSystem';
import { SubscriptionCore } from '../services/Subscription/SubscriptionCore';

interface AuthContextType {
  user: User | null;
  login: (userData: Partial<User>, password?: string) => Promise<{ success: boolean; error?: string }>;
  register: (userData: Partial<User>) => Promise<{ success: boolean; error?: string }>;
  signInWithGoogle: () => Promise<void>;
  signInWithProvider: (provider: LoginProvider) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  
  // Custom Dashboard
  saveUserFormFields: (fields: Record<string, string>) => Promise<boolean>;
  markCourseComplete: (courseId: string) => Promise<boolean>; 
  completeCourse: (course: any, score: number, grade: string) => void;
  checkProfileCompleteness: () => number;

  // Simulated Systems
  notifications: Notification[];
  markNotificationRead: (id: string) => void;
  sendSystemNotification: (userId: string, title: string, message: string, type?: Notification['type']) => void;
  createSupportTicket: (ticket: any) => void;
  
  // Data Access
  allJobs: any[];
  allServices: any[];
  allProducts: any[];
  
  // Marketplace Actions
  createProduct: (productData: any) => { success: boolean; error?: string };
  purchaseService: (service: any, transaction: any) => { success: boolean; error?: string };
  confirmReceipt: (txId: string) => void;
  markDelivered: (txId: string) => void;
  myTransactions: any[];
  
  // Job Actions
  manualJobs: any[];
  addManualJob: (job: any) => void;
  editManualJob: (id: string, data: any) => void;
  deleteManualJob: (id: string) => void;

  // Additional Actions
  publishUserContent: (type: 'Course'|'Project'|'Service', data: any) => Promise<{success: boolean, error?: string}>;
  submitCVRequest: (data: any) => void;
  addAcademicProject: (data: any) => boolean;
  
  // Identity
  submitIdentityVerification: (provider: string) => Promise<{success: boolean}>;
  
  // Admin Config
  adminConfig: any;
  updateAdminConfig: (cfg: any) => void;
  adminLogin: (u: string, p: string) => boolean;
  adminLogout: () => void;
  
  // System
  generateBackup: () => string;
  restoreBackup: (json: string) => boolean;
  getSystemAnalytics: () => any;
  
  // Neural Features
  brain: any; // Placeholder for CognitiveBrain instance
  healer: any; // Placeholder for Healer instance
  
  // Exam & LMS
  submitExamResult: (courseId: string, courseName: string, score: number, unlockPermission?: string) => void;
  updateCourseProgress: (courseId: string, progress: number) => void;
  enrollCourse: (courseId: string, title: string) => Promise<void>;
  uploadAssignment: (file: File, courseId: string) => Promise<string | null>;

  // Social
  followUser: (targetId: string) => void;
  unfollowUser: (targetId: string) => void;

  markProductAsSold: (productId: string) => void;
  
  incrementProductViews: (productId: string) => void;
  
  // Economy & Subscription
  depositToWallet: (amount: number) => Promise<boolean>;
  joinPrime: () => Promise<{ success: boolean; error?: string }>;

  // User Data Access
  storedUsers: User[];
  
  // UI Controls
  showLoginModal: boolean;
  setShowLoginModal: (show: boolean) => void;
  requireAuth: (callback: () => void) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

// Safe JSON Parse Helper
const safeParse = (key: string, fallback: any) => {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : fallback;
    } catch (e) {
        console.warn(`[AuthContext] Failed to parse ${key} from localStorage. Resetting to default.`, e);
        return fallback;
    }
};

// Mock Helper
const createMockUser = (base: Partial<User>): User => ({
    id: base.id || `u_${Date.now()}`,
    name: base.name || 'User',
    email: base.email || '',
    avatar: base.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${base.name || 'User'}`,
    role: 'student',
    isLoggedIn: true,
    verified: true,
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
    loginMethod: 'email',
    linkedProviders: [],
    xp: 500,
    level: 2,
    nextLevelXp: 1000,
    wallet: { id: `w_${base.id || Date.now()}`, userId: base.id || '', balance: 0, currency: 'SAR', status: 'active', ledger: [], lastUpdated: new Date().toISOString() },
    notifications: [],
    enrolledCourses: [],
    certificates: [],
    transcript: [
        { courseId: 'CS101', courseName: 'مقدمة في علوم الحاسب', creditHours: 3, grade: 'A', score: 95, completionDate: '2024-01-15', semester: 'Fall 2024' },
        { courseId: 'MKT201', courseName: 'أساسيات التسويق الرقمي', creditHours: 2, grade: 'B', score: 88, completionDate: '2024-02-20', semester: 'Spring 2024' },
        { courseId: 'AI300', courseName: 'الذكاء الاصطناعي التوليدي', creditHours: 4, grade: 'A', score: 98, completionDate: '2024-05-10', semester: 'Summer 2024' }
    ],
    trainingId: `ACD-${Math.floor(Math.random() * 10000)}`,
    ...base
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  
  // Data Holders with Safe Parsing
  const [allJobs, setAllJobs] = useState<any[]>(() => safeParse('allJobs', []));
  const [allServices, setAllServices] = useState<any[]>(() => safeParse('mylaf_services', []));
  const [allProducts, setAllProducts] = useState<any[]>(() => safeParse('allProducts', []));
  const [myTransactions, setMyTransactions] = useState<any[]>([]);
  const [manualJobs, setManualJobs] = useState<any[]>(() => safeParse('manual_jobs', []));
  const [adminConfig, setAdminConfig] = useState<any>(() => safeParse('admin_config', {}));
  
  const [storedUsers, setStoredUsers] = useState<User[]>(() => safeParse('mylaf_users', []));

  // Placeholder refs
  const brain = { 
      trackInteraction: (tag: string, w: number) => console.log('Brain track:', tag),
      personalizeList: (list: any[], extractor: any) => list 
  };
  const healer = {
      sanitize: (s: string) => s,
      safeFetch: async (k: string, p: Promise<any>, f: any) => { try { return await p } catch { return f } }
  };

  useEffect(() => {
    if (localStorage.getItem('mylaf_admin_session') === 'active') {
        setIsAdmin(true);
    }

    const localSession = safeParse('mylaf_session', null);
    if (localSession) {
         setUser(localSession);
    }

    if (auth) {
        try {
            const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: any) => {
                if (firebaseUser) {
                     if (db) {
                         try {
                             // Fetch existing data including customFormFields
                             const userRef = doc(db, "users", firebaseUser.uid);
                             const userSnap = await getDoc(userRef);
                             
                             let firestoreData = {};
                             if (userSnap.exists()) {
                                 firestoreData = userSnap.data();
                             } else {
                                 // Create initial doc if not exists
                                 await setDoc(userRef, {
                                     name: firebaseUser.displayName,
                                     email: firebaseUser.email,
                                     photo: firebaseUser.photoURL,
                                     lastLogin: new Date().toISOString()
                                 }, { merge: true });
                             }
                             
                             const appUser = createMockUser({
                                id: firebaseUser.uid,
                                name: firebaseUser.displayName || 'Social User',
                                email: firebaseUser.email || '',
                                avatar: firebaseUser.photoURL || '',
                                loginMethod: 'google',
                                isIdentityVerified: true,
                                ...firestoreData // This will include customFormFields if present
                             });
                             
                             setUser(appUser);
                             localStorage.setItem('mylaf_session', JSON.stringify(appUser));
                         } catch (e) {
                             console.error("Firestore Sync Error", e);
                         }
                     }
                }
            });
            return () => unsubscribe();
        } catch (e) {
            console.error("Firebase Auth Listener Error", e);
        }
    }
  }, []);

  const requireAuth = (callback: () => void) => {
    if (user) {
        callback();
    } else {
        setShowLoginModal(true);
    }
  };

  const signInWithGoogle = async () => {
    await signInWithProvider('google');
  };

  const signInWithProvider = async (providerName: LoginProvider) => {
    try {
      console.log(`Initiating ${providerName} Sign-In...`);
      
      let provider: any = null;
      switch (providerName) {
        case 'google': provider = googleProvider; break;
        case 'facebook': provider = facebookProvider; break;
        case 'twitter': provider = twitterProvider; break;
        case 'github': provider = githubProvider; break;
        case 'yahoo': provider = new OAuthProvider('yahoo.com'); break;
        case 'microsoft': provider = new OAuthProvider('microsoft.com'); break;
      }

      if (provider && auth) {
        await signInWithPopup(auth, provider);
      } else {
         throw new Error(`Provider ${providerName} not supported via Firebase.`);
      }
    } catch (error: any) {
      console.error(`${providerName} Sign In Error:`, error);
      alert("فشل تسجيل الدخول. يرجى التحقق من الإعدادات أو المحاولة لاحقاً.");
      // No fallback to demo user here. Strict auth.
    }
  };

  const login = async (userData: Partial<User>, password?: string) => {
      // --- SUPER ADMIN / OWNER LOGIN CHECK ---
      const inputId = userData.email || userData.name || '';
      const normId = inputId.trim().toLowerCase().replace('@', ''); // normalize 'IpMurad'

      if ((normId === 'ipmurad' || inputId.trim().toLowerCase() === 'mrada4231@gmail.com') && password === 'murad123@A') {
            const adminUser: User = createMockUser({
                id: "admin-murad-id",
                name: "Murad Aljohani",
                username: "IpMurad",
                email: "mrada4231@gmail.com",
                role: "admin",
                isLoggedIn: true,
                verified: true,
                isIdentityVerified: true,
                isGold: true,
                avatar: "https://i.ibb.co/QjNHDv3F/images-4.jpg",
                coverImage: "https://ui-avatars.com/api/?name=M&background=000000&color=ffffff&size=1920&font-size=0.5&bold=true&length=1",
                bio: "Founder & CEO of Milaf | مؤسس مجتمع ميلاف 🦅",
                currentJobTitle: "CEO & Founder",
                permissions: ['admin', 'god_mode'],
                followersCount: 11711
            });
            
            setUser(adminUser);
            setIsAdmin(true);
            localStorage.setItem('mylaf_session', JSON.stringify(adminUser));
            localStorage.setItem('mylaf_admin_session', 'active');
            saveUserToDB(adminUser);
            return { success: true };
      }

      // Standard Login
      const u = createMockUser(userData);
      setUser(u);
      localStorage.setItem('mylaf_session', JSON.stringify(u));
      saveUserToDB(u);
      return { success: true };
  };

  const register = async (userData: Partial<User>) => {
      return login(userData);
  };

  const logout = async () => {
      if (auth) await signOut(auth).catch(console.error);
      setUser(null);
      setIsAdmin(false);
      localStorage.removeItem('mylaf_session');
      localStorage.removeItem('mylaf_admin_session');
  };

  const updateProfile = (data: Partial<User>) => {
      if (user) {
          const updated = { ...user, ...data };
          setUser(updated);
          localStorage.setItem(`user_${user.id}`, JSON.stringify(updated));
          localStorage.setItem('mylaf_session', JSON.stringify(updated));
          saveUserToDB(updated);
          
          if (db) {
             const userRef = doc(db, "users", user.id);
             setDoc(userRef, data, { merge: true }).catch(err => console.error("Update profile sync error", err));
          }
      }
  };
  
  const saveUserFormFields = async (fields: Record<string, string>) => {
      if (!user) return false;
      try {
          const updated = { ...user, customFormFields: fields };
          setUser(updated);
          localStorage.setItem('mylaf_session', JSON.stringify(updated));
          
          if (db) {
              const flatFields: any = {};
              Object.entries(fields).forEach(([k, v]) => {
                  flatFields[k] = v;
              });
              const userRef = doc(db, "users", user.id);
              await setDoc(userRef, flatFields, { merge: true });
          }
          return true;
      } catch (e) {
          console.error("Error saving form fields", e);
          return false;
      }
  };

  const markCourseComplete = async (courseId: string) => {
      if (!user) return false;
      try {
        if (db) {
            // Save to specific subcollection as requested
            await setDoc(doc(db, "users", user.id, "completed_courses", `course_${courseId}`), {
                passed: true,
                date: new Date(),
                courseId: courseId
            });
        }
        // Also update local user state for UI consistency
        const certs = user.certificates || [];
        // Only add if not exists
        if(!certs.find(c => c.courseName === `الدورة رقم ${courseId}`)) {
            certs.push({
                id: `CERT-${courseId}-${Date.now()}`,
                userId: user.id,
                courseName: `الدورة رقم ${courseId}`,
                trainingNumber: user.trainingId || 'N/A',
                finalScore: 100,
                grade: 'Passed',
                hours: 5,
                issuedAt: new Date().toISOString(),
                provider: 'Mylaf Academy',
                verifyCode: `V-${Date.now()}`,
                type: 'Course'
            });
            updateProfile({ certificates: certs });
        }
        return true;
      } catch (e) {
          console.error("Error marking course complete", e);
          return false;
      }
  };
  
  const completeCourse = (course: any, score: number, grade: string) => {
      submitExamResult(course.id, course.title, score);
  };

  const saveUserToDB = (u: User) => {
      const users = [...storedUsers];
      const idx = users.findIndex(ex => ex.id === u.id);
      if (idx > -1) users[idx] = u;
      else users.push(u);
      setStoredUsers(users);
      localStorage.setItem('mylaf_users', JSON.stringify(users));
  };

  const createProduct = (productData: any) => {
      if (!user) return { success: false, error: 'Unauthorized' };
      const newProduct = {
          ...productData,
          id: `p_${Date.now()}`,
          sellerId: user.id,
          sellerName: user.name,
          sellerAvatar: user.avatar,
          sellerVerified: user.isIdentityVerified,
          createdAt: new Date().toISOString(),
          status: 'active',
          views: 0
      };
      const updated = [newProduct, ...allProducts];
      setAllProducts(updated);
      localStorage.setItem('allProducts', JSON.stringify(updated));
      
      const stats = user.publisherStats || { coursesCount: 0, projectsCount: 0, servicesCount: 0, totalSales: 0, rating: 5 };
      updateProfile({ 
          publishedItems: [...(user.publishedItems || []), { id: newProduct.id, type: 'Service', title: newProduct.title, status: 'Active', createdAt: newProduct.createdAt, price: newProduct.price }],
          publisherStats: stats
      });
      
      return { success: true };
  };

  const purchaseService = (service: any, transaction: any) => {
      if (!user) return { success: false, error: 'Unauthorized' };
      
      const newTx = {
          id: transaction.id || `txn_${Date.now()}`,
          serviceId: service.id,
          serviceTitle: service.title,
          buyerId: user.id,
          buyerName: user.name,
          sellerId: service.sellerId,
          sellerName: service.sellerName,
          amount: service.price,
          status: 'in_progress',
          createdAt: new Date().toISOString()
      };

      setMyTransactions([newTx, ...myTransactions]);
      
      return { success: true };
  };

  const confirmReceipt = (txId: string) => {
      setMyTransactions(prev => prev.map(tx => tx.id === txId ? { ...tx, status: 'completed' } : tx));
  };

  const markDelivered = (txId: string) => {
      setMyTransactions(prev => prev.map(tx => tx.id === txId ? { ...tx, status: 'delivered' } : tx));
  };

  const markProductAsSold = (pid: string) => {
      const updated = allProducts.map(p => p.id === pid ? { ...p, status: 'sold' } : p);
      setAllProducts(updated);
      localStorage.setItem('allProducts', JSON.stringify(updated));
  };
  
  const incrementProductViews = (pid: string) => {
      const updated = allProducts.map(p => p.id === pid ? { ...p, views: (p.views || 0) + 1 } : p);
      setAllProducts(updated);
      localStorage.setItem('allProducts', JSON.stringify(updated));
  };

  const addManualJob = (job: any) => {
      const newJob = { ...job, id: `mj_${Date.now()}` };
      const updated = [newJob, ...manualJobs];
      setManualJobs(updated);
      localStorage.setItem('manual_jobs', JSON.stringify(updated));
  };

  const editManualJob = (id: string, data: any) => {
      const updated = manualJobs.map(j => j.id === id ? { ...j, ...data } : j);
      setManualJobs(updated);
      localStorage.setItem('manual_jobs', JSON.stringify(updated));
  };

  const deleteManualJob = (id: string) => {
      const updated = manualJobs.filter(j => j.id !== id);
      setManualJobs(updated);
      localStorage.setItem('manual_jobs', JSON.stringify(updated));
  };

  const enrollCourse = async (courseId: string, title: string) => {
      if (!user) return;
      if (db) {
          try {
              await setDoc(doc(db, "users", user.id, "enrolled", courseId), {
                  joinedAt: new Date().toISOString(),
                  courseId,
                  title
              });
          } catch (e) {
              console.error("Error enrolling in Firestore", e);
          }
      }
      
      const enrolled = user.enrolledCourses || [];
      if (!enrolled.find(c => c.courseId === courseId)) {
          enrolled.push({ courseId, progress: 0, status: 'active', lastAccessed: new Date().toISOString() });
          updateProfile({ enrolledCourses: enrolled });
      }
  };

  const updateCourseProgress = async (courseId: string, progress: number) => {
      if (!user) return;
      
      if (db) {
          try {
              await setDoc(doc(db, "users", user.id, "progress", courseId), {
                  percent: progress,
                  lastUpdated: new Date().toISOString()
              }, { merge: true });
          } catch (e) {
              console.error("Error saving progress", e);
          }
      }

      const enrolled = user.enrolledCourses || [];
      const idx = enrolled.findIndex(c => c.courseId === courseId);
      
      if (idx > -1) {
          enrolled[idx].progress = progress;
          enrolled[idx].lastAccessed = new Date().toISOString();
      } else {
          enrolled.push({ courseId, progress, status: 'active', lastAccessed: new Date().toISOString() });
      }
      updateProfile({ enrolledCourses: enrolled });
  };
  
  const uploadAssignment = async (file: File, courseId: string): Promise<string | null> => {
      if (!user || !storage) return null;
      try {
          const storageRef = ref(storage, `assignments/${user.id}/${courseId}/${file.name}`);
          const snapshot = await uploadBytes(storageRef, file);
          const url = await getDownloadURL(snapshot.ref);
          return url;
      } catch (e) {
          console.error("Upload error", e);
          return null;
      }
  };

  const submitExamResult = (courseId: string, courseName: string, score: number, unlockPermission?: string) => {
      if (!user) return;
      
      const transcript = user.transcript || [];
      transcript.push({
          courseId,
          courseName,
          creditHours: 3, 
          grade: score >= 90 ? 'A' : score >= 80 ? 'B' : 'C',
          score,
          completionDate: new Date().toISOString(),
          semester: `Term ${new Date().getFullYear()}`
      });

      const certs = user.certificates || [];
      certs.push({
          id: `CRT-${new Date().getFullYear()}-${Math.floor(Math.random()*10000)}`,
          userId: user.id,
          courseName,
          trainingNumber: user.trainingId || 'N/A',
          finalScore: score,
          grade: score >= 90 ? 'ممتاز' : 'جيد جداً',
          hours: 15,
          issuedAt: new Date().toISOString(),
          provider: 'Mylaf Academy',
          verifyCode: `V-${Date.now()}`,
          type: 'Course'
      });

      let perms = user.permissions || [];
      if (unlockPermission && !perms.includes(unlockPermission)) {
          perms.push(unlockPermission);
      }

      updateProfile({ transcript, certificates: certs, permissions: perms });
  };

  const followUser = (targetId: string) => {
      if (!user) return;
      const following = user.following || [];
      if (!following.includes(targetId)) {
          updateProfile({ following: [...following, targetId] });
      }
  };

  const unfollowUser = (targetId: string) => {
      if (!user) return;
      updateProfile({ following: (user.following || []).filter(id => id !== targetId) });
  };

  // --- UPDATED ADMIN LOGIN LOGIC ---
  const adminLogin = (u: string, p: string) => {
      const normalizedUser = u.trim().toLowerCase().replace('@', '');
      
      // Check for Admin Credentials (Username OR Email)
      if ((normalizedUser === 'ipmurad' || u.trim().toLowerCase() === 'mrada4231@gmail.com') && p === 'murad123@A') {
          setIsAdmin(true);
          localStorage.setItem('mylaf_admin_session', 'active');
          
          // Force login as Admin if not already
          if (!user || user.id !== 'admin-murad-id') {
               const adminUser: User = createMockUser({
                    id: "admin-murad-id",
                    name: "Murad Aljohani",
                    username: "IpMurad",
                    email: "mrada4231@gmail.com",
                    role: "admin",
                    isLoggedIn: true,
                    verified: true,
                    isIdentityVerified: true,
                    isGold: true,
                    avatar: "https://i.ibb.co/QjNHDv3F/images-4.jpg",
                    coverImage: "https://ui-avatars.com/api/?name=M&background=000000&color=ffffff&size=1920&font-size=0.5&bold=true&length=1",
                    bio: "Founder & CEO of Milaf | مؤسس مجتمع ميلاف 🦅",
                    currentJobTitle: "CEO & Founder",
                    permissions: ['admin', 'god_mode'],
                    followersCount: 11711
                });
                setUser(adminUser);
                localStorage.setItem('mylaf_session', JSON.stringify(adminUser));
          }

          return true;
      }
      return false;
  };

  const updateAdminConfig = (cfg: any) => {
      const newConfig = { ...adminConfig, ...cfg };
      setAdminConfig(newConfig);
      localStorage.setItem('admin_config', JSON.stringify(newConfig));
  };

  const generateBackup = () => {
      const backup = {
          users: storedUsers,
          jobs: manualJobs,
          products: allProducts,
          transactions: safeParse('mylaf_transactions', []),
          config: adminConfig,
          timestamp: new Date().toISOString()
      };
      return JSON.stringify(backup);
  };

  const restoreBackup = (json: string) => {
      try {
          const data = JSON.parse(json);
          if (data.users) {
              setStoredUsers(data.users);
              localStorage.setItem('mylaf_users', JSON.stringify(data.users));
          }
          if (data.jobs) {
              setManualJobs(data.jobs);
              localStorage.setItem('manual_jobs', JSON.stringify(data.jobs));
          }
          return true;
      } catch (e) {
          return false;
      }
  };

  const getSystemAnalytics = () => {
      return {
          usersCount: storedUsers.length,
          jobsCount: manualJobs.length + allJobs.length,
          productsCount: allProducts.length,
          totalRevenue: 154000, 
          serverLoad: 45
      };
  };

  const markNotificationRead = (id: string) => {
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };
  const sendSystemNotification = (uid: string, t: string, m: string, type: any) => {
      const notif: Notification = { id: `n_${Date.now()}`, userId: uid, title: t, message: m, type, isRead: false, date: new Date().toISOString() };
      setNotifications(prev => [notif, ...prev]);
      if (user && user.id === uid) updateProfile({ notifications: [notif, ...(user.notifications || [])] });
  };
  const publishUserContent = async (type: any, data: any) => { 
      createProduct({ ...data, type });
      return { success: true }; 
  };
  const submitCVRequest = (data: any) => {
      const req = { ...data, id: `cv_${Date.now()}`, status: 'pending', createdAt: new Date().toISOString() };
      const reqs = user?.cvRequests || [];
      updateProfile({ cvRequests: [req, ...reqs] });
  };
  const addAcademicProject = (data: any) => {
      const proj = { ...data, id: `ap_${Date.now()}`, status: 'approved', createdAt: new Date().toISOString() };
      const projs = user?.academicProjects || [];
      updateProfile({ academicProjects: [proj, ...projs] });
      return true;
  };
  const submitIdentityVerification = async (provider: string) => {
      return new Promise<{success: boolean}>(resolve => {
          setTimeout(() => {
              updateProfile({ kycStatus: 'verified', isIdentityVerified: true });
              resolve({ success: true });
          }, 2000);
      });
  };
  const adminLogout = () => { setIsAdmin(false); localStorage.removeItem('mylaf_admin_session'); };

  const checkProfileCompleteness = () => {
      if (!user) return 0;
      let score = 0;
      if (user.name) score += 20;
      if (user.email) score += 20;
      if (user.phone) score += 20;
      if (user.isIdentityVerified) score += 20;
      if (user.cvRequests?.length) score += 10;
      if (user.bio) score += 10;
      return Math.min(100, score);
  };

  const depositToWallet = async (amount: number) => {
      if (!user) return false;
      const res = await WalletSystem.getInstance().processTransaction(user.wallet?.id || `w_${user.id}`, 'DEPOSIT', amount, 'Deposit');
      if (res.success) {
          const updatedWallet = WalletSystem.getInstance().getOrCreateWallet(user);
          updateProfile({ wallet: updatedWallet });
          return true;
      }
      return false;
  };

  const createSupportTicket = (ticket: any) => {
      if (!user) return;
      const tickets = user.supportTickets || [];
      updateProfile({ supportTickets: [...tickets, ticket] });
  };

  const joinPrime = async () => {
      if (!user) return { success: false, error: 'User not found' };
      const res = await SubscriptionCore.getInstance().joinPrime(user);
      if (res.success && res.updatedUser) {
          setUser(res.updatedUser);
          localStorage.setItem('mylaf_session', JSON.stringify(res.updatedUser));
          return { success: true };
      }
      return { success: false, error: res.error };
  };

  return (
    <AuthContext.Provider value={{ 
        user, login, logout, signInWithGoogle, signInWithProvider, updateProfile, register,
        isAuthenticated: !!user, isAdmin,
        notifications, markNotificationRead, sendSystemNotification,
        allJobs, allServices, allProducts, myTransactions,
        createProduct, purchaseService, confirmReceipt, markDelivered,
        manualJobs, addManualJob, editManualJob, deleteManualJob,
        publishUserContent, submitCVRequest, addAcademicProject,
        submitIdentityVerification,
        adminConfig, updateAdminConfig, adminLogin, adminLogout,
        generateBackup, restoreBackup, getSystemAnalytics,
        brain, healer,
        submitExamResult, updateCourseProgress, enrollCourse, uploadAssignment, completeCourse,
        followUser, unfollowUser,
        markProductAsSold, incrementProductViews,
        storedUsers,
        showLoginModal, setShowLoginModal, requireAuth,
        saveUserFormFields,
        markCourseComplete, checkProfileCompleteness,
        depositToWallet, createSupportTicket, joinPrime
    }}>
      {children}
    </AuthContext.Provider>
  );
};
