
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Notification, LoginProvider, SupportTicket } from '../types';
import { auth, db, storage, googleProvider, facebookProvider, twitterProvider, githubProvider } from '../src/lib/firebase';
import { signInWithPopup, signOut, onAuthStateChanged, AuthProvider as FirebaseAuthProvider } from 'firebase/auth';
import { doc, setDoc, getDoc, collection, addDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { WalletSystem } from '../services/Economy/WalletSystem';
import { SubscriptionCore } from '../services/Subscription/SubscriptionCore';

interface AuthContextType {
  user: User | null;
  login: (userData: Partial<User>, password?: string) => Promise<{ success: boolean; error?: string }>;
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
  createSupportTicket: (ticket: SupportTicket) => void;
  
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
  register: (userData: Partial<User>) => Promise<{ success: boolean; error?: string }>;
  
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
  
  // Wallet & Subscription
  depositToWallet: (amount: number) => Promise<boolean>;
  joinPrime: () => Promise<{ success: boolean; updatedUser?: User; error?: string }>;

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

// Mock Helper
const createMockUser = (base: Partial<User>): User => ({
    id: base.id || `u_${Date.now()}`,
    name: base.name || 'User',
    email: base.email || '',
    avatar: base.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${base.name}`,
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
  
  // Data Holders
  const [allJobs, setAllJobs] = useState<any[]>(() => JSON.parse(localStorage.getItem('allJobs') || '[]'));
  const [allServices, setAllServices] = useState<any[]>(() => JSON.parse(localStorage.getItem('mylaf_services') || '[]'));
  const [allProducts, setAllProducts] = useState<any[]>(() => JSON.parse(localStorage.getItem('allProducts') || '[]'));
  const [myTransactions, setMyTransactions] = useState<any[]>([]);
  const [manualJobs, setManualJobs] = useState<any[]>(() => JSON.parse(localStorage.getItem('manual_jobs') || '[]'));
  const [adminConfig, setAdminConfig] = useState<any>(() => JSON.parse(localStorage.getItem('admin_config') || '{}'));
  
  const [storedUsers, setStoredUsers] = useState<User[]>(() => JSON.parse(localStorage.getItem('mylaf_users') || '[]'));

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

    const localSession = localStorage.getItem('mylaf_session');
    if (localSession) {
         setUser(JSON.parse(localSession));
    }

    if (auth) {
        try {
            const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
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
      
      // Explicitly check if auth is available
      if (!auth) {
        console.warn("Firebase Auth not initialized, falling back to demo mode.");
        throw new Error("Firebase Auth not initialized");
      }
      
      let provider: FirebaseAuthProvider | null = null;
      switch (providerName) {
        case 'google': provider = googleProvider; break;
        case 'facebook': provider = facebookProvider; break;
        case 'twitter': provider = twitterProvider; break;
        case 'github': provider = githubProvider; break;
      }

      if (provider) {
        await signInWithPopup(auth, provider);
      } else {
         throw new Error(`Provider ${providerName} not supported via Firebase.`);
      }
    } catch (error: any) {
        console.error("Sign in error:", error);
        // Demo fallback
        const mockUser = createMockUser({ name: 'Demo User', email: 'demo@example.com', loginMethod: providerName });
        setUser(mockUser);
        localStorage.setItem('mylaf_session', JSON.stringify(mockUser));
    }
  };

  const login = async (userData: Partial<User>, password?: string) => {
      const mockUser = createMockUser(userData);
      setUser(mockUser);
      localStorage.setItem('mylaf_session', JSON.stringify(mockUser));
      return { success: true };
  };

  const logout = async () => {
      if (auth) await signOut(auth);
      setUser(null);
      localStorage.removeItem('mylaf_session');
      setIsAdmin(false);
      localStorage.removeItem('mylaf_admin_session');
  };

  const updateProfile = (data: Partial<User>) => {
      if (!user) return;
      const updated = { ...user, ...data };
      setUser(updated);
      localStorage.setItem('mylaf_session', JSON.stringify(updated));
      
      // Sync to Firestore if available
      if (db && user.id) {
          const userRef = doc(db, 'users', user.id);
          updateDoc(userRef, data).catch(console.error);
      }
  };

  const saveUserFormFields = async (fields: Record<string, string>) => {
      if (!user) return false;
      updateProfile({ customFormFields: fields });
      return true;
  };

  const markCourseComplete = async (courseId: string) => {
      if (!user) return false;
      const updatedCourses = user.enrolledCourses || [];
      const courseIndex = updatedCourses.findIndex(c => c.courseId === courseId);
      if (courseIndex > -1) {
          updatedCourses[courseIndex].status = 'completed';
          updatedCourses[courseIndex].progress = 100;
      } else {
          updatedCourses.push({
              courseId,
              progress: 100,
              status: 'completed',
              lastAccessed: new Date().toISOString()
          });
      }
      updateProfile({ enrolledCourses: updatedCourses });
      return true;
  };

  // --- Mock Methods for Interface Compliance ---
  const markNotificationRead = (id: string) => {
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };
  const sendSystemNotification = (userId: string, title: string, message: string, type: Notification['type'] = 'system') => {
      const newNotif: Notification = {
          id: Date.now().toString(),
          userId,
          title,
          message,
          type,
          isRead: false,
          date: new Date().toISOString()
      };
      setNotifications(prev => [newNotif, ...prev]);
  };
  const createSupportTicket = (ticket: SupportTicket) => { console.log('Ticket created', ticket); };
  const createProduct = (productData: any) => { return { success: true }; };
  const purchaseService = (service: any, transaction: any) => { return { success: true }; };
  const confirmReceipt = (txId: string) => {};
  const markDelivered = (txId: string) => {};
  const addManualJob = (job: any) => { setManualJobs(prev => [...prev, job]); };
  const editManualJob = (id: string, data: any) => {};
  const deleteManualJob = (id: string) => {};
  const publishUserContent = async () => { return { success: true }; };
  const submitCVRequest = () => {};
  const addAcademicProject = () => true;
  const register = async (userData: Partial<User>) => { return await login(userData); };
  const submitIdentityVerification = async () => { return { success: true }; };
  const updateAdminConfig = (cfg: any) => { setAdminConfig(prev => ({ ...prev, ...cfg })); };
  const adminLogin = (u: string, p: string) => { 
      if(u==='MURAD' && p==='MURAD123@A') { setIsAdmin(true); return true; }
      return false;
  };
  const adminLogout = () => setIsAdmin(false);
  const generateBackup = () => JSON.stringify({ user, allJobs, allServices });
  const restoreBackup = () => true;
  const getSystemAnalytics = () => ({ totalRevenue: 50000, usersCount: 150 });
  const submitExamResult = () => {};
  const updateCourseProgress = () => {};
  const enrollCourse = async () => {};
  const uploadAssignment = async () => null;
  const completeCourse = () => {};
  const checkProfileCompleteness = () => 80;
  const followUser = () => {};
  const unfollowUser = () => {};
  const markProductAsSold = () => {};
  const incrementProductViews = () => {};
  const depositToWallet = async () => true;
  const joinPrime = async () => ({ success: true });

  const value = {
      user,
      login,
      signInWithGoogle,
      signInWithProvider,
      logout,
      updateProfile,
      isAuthenticated: !!user,
      isAdmin,
      saveUserFormFields,
      markCourseComplete,
      completeCourse,
      checkProfileCompleteness,
      notifications,
      markNotificationRead,
      sendSystemNotification,
      createSupportTicket,
      allJobs,
      allServices,
      allProducts,
      createProduct,
      purchaseService,
      confirmReceipt,
      markDelivered,
      myTransactions,
      manualJobs,
      addManualJob,
      editManualJob,
      deleteManualJob,
      publishUserContent,
      submitCVRequest,
      addAcademicProject,
      register,
      submitIdentityVerification,
      adminConfig,
      updateAdminConfig,
      adminLogin,
      adminLogout,
      generateBackup,
      restoreBackup,
      getSystemAnalytics,
      brain,
      healer,
      submitExamResult,
      updateCourseProgress,
      enrollCourse,
      uploadAssignment,
      followUser,
      unfollowUser,
      markProductAsSold,
      incrementProductViews,
      depositToWallet,
      joinPrime,
      storedUsers,
      showLoginModal,
      setShowLoginModal,
      requireAuth
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
