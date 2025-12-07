
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, ServiceListing, UserJob, Course, EnrolledCourse, Certificate, AcademicProject, Transaction, RegistrationData, SecurityLog, Achievement, Badge, AssignmentSubmission, ExamAttempt, AdminConfig, Department, ReadBook, Book, LearningPath, AIAnalysisResult, Notification, CVRequest, ProductListing, PublishedContent, KYCData, ServiceCategory, ProductCategory, Wallet, Invoice, SupportTicket, ViralStats, Story, PrimeSubscription, EcosystemProfile, TranscriptEntry } from '../types';
import { RealAuthService } from '../services/realAuthService';
import { generateAICourseContent, analyzeProfileWithAI } from '../services/geminiService';
import { SecurityCore } from '../services/SecurityCore';
import { OFFICIAL_SEAL_CONFIG } from '../constants/officialAssets';

// --- FIREBASE IMPORTS ---
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../src/lib/firebase';

// --- FLUID ENGINES ---
import { AccessGate } from '../services/Fluid/AccessGate';
import { CognitiveBrain } from '../services/Fluid/CognitiveBrain';
import { AutonomicHealer } from '../services/Fluid/AutonomicHealer';

// --- ECONOMY ENGINES ---
import { WalletSystem } from '../services/Economy/WalletSystem';
import { InvoiceSystem } from '../services/Economy/InvoiceSystem';
import { CommissionEngine } from '../services/Economy/CommissionEngine';
import { PricingAI } from '../services/Economy/PricingAI';
import { FinanceCore } from '../services/Economy/FinanceCore';

// --- VIRAL & STORY ENGINE ---
import { ViralEngine } from '../services/Expansion/ViralEngine';
import { StoryEngine } from '../services/Stories/StoryEngine';

// --- GOVERNANCE ENGINE ---
import { GovernanceCore } from '../services/Governance/GovernanceCore';

// --- SUBSCRIPTION ENGINE ---
import { SubscriptionCore } from '../services/Subscription/SubscriptionCore';

// --- IRON DOME ---
import { IronDome } from '../services/IronDome/IronDomeCore';

interface AuthContextType {
  user: User | null;
  login: (userData: Partial<User>, password?: string) => Promise<{ success: boolean; error?: string }>;
  signInWithGoogle: () => Promise<void>; // Added Google Sign In
  register: (data: RegistrationData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  resetPassword: (email: string) => Promise<boolean>;
  updateProfile: (data: Partial<User>) => void;
  verifyUserAttribute: (type: 'phone' | 'email') => Promise<boolean>;
  submitIdentityVerification: (provider: 'Stripe Identity' | 'Onfido' | 'Veriff') => Promise<{ success: boolean; error?: string }>;
  updateIBAN: (iban: string) => { success: boolean; error?: string };
  isAuthenticated: boolean;
  checkProfileCompleteness: () => number;
  
  createService: (service: Omit<ServiceListing, 'id' | 'createdAt' | 'sellerName' | 'sellerId' | 'rating' | 'reviewCount' | 'status' | 'sellerVerified' | 'sales'>) => { success: boolean; error?: string };
  createJob: (job: Omit<UserJob, 'id' | 'createdAt' | 'status'>) => boolean;
  createProduct: (product: Omit<ProductListing, 'id' | 'createdAt' | 'sellerName' | 'sellerId' | 'sellerVerified' | 'sellerAvatar' | 'views' | 'contactClicks' | 'isSuspicious'> & { status?: ProductListing['status'] }) => { success: boolean; error?: string };
  markProductAsSold: (productId: string) => void; 
  incrementProductViews: (productId: string) => void; 
  allServices: ServiceListing[];
  allProducts: ProductListing[]; 
  allJobs: UserJob[];
  storedUsers: User[]; 
  myTransactions: Transaction[];
  purchaseService: (item: ServiceListing | ProductListing, transactionDetails: any) => { success: boolean; error?: string };
  placeBid: (productId: string, amount: number) => { success: boolean; error?: string };
  markDelivered: (transactionId: string) => void;
  confirmReceipt: (transactionId: string) => void;
  rateTransaction: (transactionId: string, rating: number, comment: string) => void;

  isAdmin: boolean;
  adminLogin: (u: string, p: string) => boolean;
  adminLogout: () => void;
  manualJobs: any[];
  addManualJob: (job: any) => void;
  editManualJob: (id: string, updatedJob: any) => void;
  deleteManualJob: (id: string) => void;

  submitCVRequest: (req: Omit<CVRequest, 'id' | 'status' | 'createdAt' | 'userId'>) => void;
  publishUserContent: (type: 'Course' | 'Project' | 'Service', data: any) => Promise<{success: boolean; error?: string}>;
  addAcademicProject: (project: Omit<AcademicProject, 'id' | 'createdAt' | 'status' | 'paymentStatus' | 'transactionId'> & { fee: number, transactionId: string }) => boolean;
  enrollCourse: (course: Course, paymentId?: string) => void;
  updateCourseProgress: (courseId: string, progress: number) => void;
  completeCourse: (course: Course, score: number, grade: string) => void;
  submitAssignment: (assignmentId: string, fileUrl: string) => void;
  markAttendance: (courseId: string, sessionId: string) => void;
  submitExamResult: (courseId: string, courseName: string, score: number, unlockPermission?: string) => void;
  
  notifications: Notification[];
  markNotificationRead: (id: string) => void;
  sendSystemNotification: (userId: string, title: string, message: string, type?: Notification['type']) => void;

  startReadingBook: (book: Book) => void;
  updateBookProgress: (bookId: string, page: number, total: number) => void;
  
  adminConfig: AdminConfig;
  updateAdminConfig: (config: Partial<AdminConfig>) => void;
  generateBackup: () => string;
  restoreBackup: (json: string) => boolean;
  getSystemAnalytics: () => any;
  
  generateCourse: (topic: string, level: string) => Promise<Course | null>;
  runAIAnalysis: () => Promise<void>;
  aiGeneratedCourses: Course[];

  searchContent: (query: string) => { services: ServiceListing[], jobs: UserJob[] };
  createSupportTicket: (ticket: SupportTicket) => boolean;
  
  followUser: (targetId: string) => void;
  unfollowUser: (targetId: string) => void;

  brain: CognitiveBrain;
  healer: AutonomicHealer;

  walletSystem: WalletSystem;
  pricingAI: PricingAI;
  depositToWallet: (amount: number) => Promise<boolean>;
  
  createStory: (media: string, type: 'image' | 'video', overlays: any[], isBoosted: boolean) => void;

  governance: GovernanceCore;

  // Subscription Methods
  joinPrime: () => Promise<{ success: boolean; error?: string }>;
  checkUpsellTrigger: () => { showUpsell: boolean; reason?: 'HeavySeller' | 'JobSeeker' | 'Learner' };

  // ACTION GATING
  requireAuth: (action: () => void) => void;
  showLoginModal: boolean;
  setShowLoginModal: (show: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// --- OFFICIAL SEAL ASSETS ---
const DEFAULT_SIGNATURE = OFFICIAL_SEAL_CONFIG.signature;
const DEFAULT_STAMP = OFFICIAL_SEAL_CONFIG.seal;

const MOCK_JOBS: UserJob[] = [
  {
    id: 'j1',
    title: 'مساعد إداري (عن بعد)',
    company: 'شركة الحلول السريعة',
    description: 'مطلوب مساعد إداري لتنظيم المواعيد وإدارة البريد الإلكتروني.',
    location: 'عن بعد',
    type: 'Part-time',
    createdAt: new Date().toISOString(),
    status: 'active'
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false); // Global login trigger

  const security = SecurityCore.getInstance();
  
  // INSTANCES
  const accessGate = AccessGate.getInstance();
  const brain = CognitiveBrain.getInstance();
  const healer = AutonomicHealer.getInstance();
  const walletSystem = WalletSystem.getInstance();
  const pricingAI = PricingAI.getInstance();
  const financeCore = FinanceCore.getInstance();
  const viralEngine = ViralEngine.getInstance();
  const storyEngine = StoryEngine.getInstance();
  const governance = GovernanceCore.getInstance();
  const subscriptionCore = SubscriptionCore.getInstance(); 

  // ... (State Initialization) ...
  const [allServices, setAllServices] = useState<ServiceListing[]>(() => {
      try { return JSON.parse(localStorage.getItem('mylaf_services') || '[]'); } catch (e) { return []; }
  });
  const [allProducts, setAllProducts] = useState<ProductListing[]>(() => {
      try { return JSON.parse(localStorage.getItem('allProducts') || '[]'); } catch (e) { return []; }
  });
  const [allJobs, setAllJobs] = useState<UserJob[]>(() => {
      try { return JSON.parse(localStorage.getItem('allJobs') || '[]'); } catch (e) { return MOCK_JOBS; }
  });
  const [manualJobs, setManualJobs] = useState<any[]>(() => {
      try { return JSON.parse(localStorage.getItem('manualJobs') || '[]'); } catch (e) { return []; }
  });
  const [myTransactions, setMyTransactions] = useState<Transaction[]>(() => {
      try { return JSON.parse(localStorage.getItem('mylaf_transactions') || '[]'); } catch (e) { return []; }
  });
  const [storedUsers, setStoredUsers] = useState<User[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [adminConfig, setAdminConfig] = useState<AdminConfig>({ 
      allowPrinting: true,
      ceoSignature: DEFAULT_SIGNATURE,
      academicStamp: DEFAULT_STAMP
  });
  const [aiGeneratedCourses, setAiGeneratedCourses] = useState<Course[]>([]); 

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const refCode = urlParams.get('ref');
    if (refCode) {
        viralEngine.processReferralClick(refCode);
    }

    const initializeApp = async () => {
        try {
            const restoredUser = accessGate.restoreSession();
            const usersDB = localStorage.getItem('mylaf_users');
            const storedConfig = localStorage.getItem('adminConfig');
            const storedAICourses = localStorage.getItem('aiGeneratedCourses');
            const adminSession = localStorage.getItem('mylaf_admin_session');
            
            if (storedConfig) {
                const parsedConfig = JSON.parse(storedConfig);
                setAdminConfig({
                    ...parsedConfig,
                    ceoSignature: DEFAULT_SIGNATURE,
                    academicStamp: DEFAULT_STAMP
                });
            }
            
            if (storedAICourses) setAiGeneratedCourses(JSON.parse(storedAICourses));
            if(usersDB) setStoredUsers(JSON.parse(usersDB));

            if (restoredUser) {
                const wallet = walletSystem.getOrCreateWallet(restoredUser);
                restoredUser.wallet = wallet;
                if(!restoredUser.viralStats) {
                    restoredUser.viralStats = {
                        affiliateCode: restoredUser.name.replace(/\s+/g,'').toLowerCase(),
                        totalClicks: 0,
                        totalSignups: 0,
                        totalEarnings: 0,
                        pendingPayout: 0,
                        campaigns: []
                    };
                }
                if (restoredUser.karma === undefined) restoredUser.karma = 500;
                setUser(restoredUser);
                setNotifications(restoredUser.notifications || []);
            } else {
                const currentUser = localStorage.getItem('mylaf_session');
                if (currentUser) {
                    const parsedUser = JSON.parse(currentUser);
                    if (parsedUser.authToken && security.validateSession(parsedUser.authToken)) {
                        const wallet = walletSystem.getOrCreateWallet(parsedUser);
                        parsedUser.wallet = wallet;
                        if (parsedUser.karma === undefined) parsedUser.karma = 500;
                        setUser(parsedUser);
                        setNotifications(parsedUser.notifications || []);
                    }
                }
            }

            if (adminSession === 'active') {
                setIsAdmin(true);
            }
        } catch (e) {
            console.error("Failed to initialize app data", e);
        }
    };

    initializeApp();
  }, []);

  // --- ACTION GATING SYSTEM ---
  const requireAuth = (action: () => void) => {
      if (user) {
          action();
      } else {
          setShowLoginModal(true);
      }
  };

  // --- FIREBASE GOOGLE LOGIN IMPLEMENTATION ---
  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const idToken = await user.getIdToken();

      // Send Token to Backend for Verification & Session Creation
      const response = await fetch('/api/session_login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ idToken })
      });

      if (response.ok) {
          // Redirect to the protected dashboard route served by Flask
          window.location.href = '/dashboard';
      } else {
          console.error("Backend verification failed");
          alert("فشل التحقق من الدخول في السيرفر");
      }
    } catch (error) {
      console.error("Google Sign In Error:", error);
      alert("حدث خطأ أثناء تسجيل الدخول عبر جوجل");
    }
  };

  const depositToWallet = async (amount: number) => {
      if(!user || !user.wallet) return false;
      const res = await walletSystem.processTransaction(user.wallet.id, 'DEPOSIT', amount, 'Top Up via Credit Card');
      if (res.success) {
          const updatedWallet = walletSystem.getOrCreateWallet(user);
          updateProfile({ wallet: updatedWallet });
          return true;
      }
      return false;
  };

  const adminLogin = (u: string, p: string) => {
      const safeU = healer.sanitize(u);
      if (safeU === 'MURAD' && p === 'MURAD123@A') {
          setIsAdmin(true);
          localStorage.setItem('mylaf_admin_session', 'active');
          return true;
      }
      return false;
  };

  const adminLogout = () => {
      setIsAdmin(false);
      localStorage.removeItem('mylaf_admin_session');
  };

  const saveUsersDB = (users: User[]) => {
      setStoredUsers(users);
      localStorage.setItem('mylaf_users', JSON.stringify(users));
  };

  const updateProfile = async (data: Partial<User>) => {
    if (user) {
      const sanitizedData = security.sanitizeObject(data);
      const updatedUser = { ...user, ...sanitizedData };
      setUser(updatedUser);
      accessGate.persistSession(updatedUser);
      localStorage.setItem('mylaf_session', JSON.stringify(updatedUser));
      const newDB = storedUsers.map(u => u.id === user.id ? updatedUser : u);
      saveUsersDB(newDB);
    }
  };

  const markNotificationRead = (id: string) => {
      if (user && user.notifications) {
          const updatedNotifs = user.notifications.map(n => n.id === id ? { ...n, isRead: true } : n);
          updateProfile({ notifications: updatedNotifs });
      }
  };

  const sendSystemNotification = (userId: string, title: string, message: string, type: Notification['type'] = 'system') => {
      const newNotif: Notification = { id: `n_${Date.now()}`, userId, type, title, message, isRead: false, date: new Date().toISOString() };
      if (user && user.id === userId) {
          updateProfile({ notifications: [newNotif, ...(user.notifications || [])] });
      }
  };

  const joinPrime = async () => {
      if (!user) return { success: false, error: 'Not logged in' };
      const res = await subscriptionCore.joinPrime(user);
      if (res.success && res.updatedUser) {
          updateProfile(res.updatedUser);
          sendSystemNotification(user.id, "ترقية العضوية", "أهلاً بك في نادي النخبة (Murad Elite)! تم تفعيل جميع المزايا.", "success");
          return { success: true };
      }
      return res;
  };

  const checkUpsellTrigger = () => {
      if (!user) return { showUpsell: false };
      return subscriptionCore.analyzeUserForUpsell(user);
  };

  const publishUserContent = async (type: 'Course' | 'Project' | 'Service', data: any): Promise<{success: boolean; error?: string}> => {
      if(!user) return { success: false, error: 'User not logged in' };
      if (!IronDome.Firewall.inspect(data.description, 'Content Publish')) {
          return { success: false, error: 'Security Violation: Malicious content detected.' };
      }
      if (!data.transactionId && !data.receipt) {
          return { success: false, error: 'Payment Verification Required (Receipt Missing)' };
      }
      if (data.receipt) {
          const financeRes = await financeCore.submitBankTransfer({
              userId: user.id,
              userName: user.name,
              serviceTitle: `Publication Fee: ${data.title}`,
              amount: data.price > 0 ? data.price * 0.1 : 50,
              receiptFile: data.receipt,
              category: 'Market'
          });
          if (!financeRes.success) return { success: false, error: financeRes.error };
      }
      await new Promise(r => setTimeout(r, 1000));
      const newItem: PublishedContent = { id: `${type.toLowerCase()}_${Date.now()}`, type, title: data.title, status: 'Pending', createdAt: new Date().toISOString(), price: data.price || 0, views: 0 };
      const newStats = { ...user.publisherStats };
      if (type === 'Course') newStats.coursesCount = (newStats.coursesCount || 0) + 1;
      if (type === 'Project') newStats.projectsCount = (newStats.projectsCount || 0) + 1;
      if (type === 'Service') newStats.servicesCount = (newStats.servicesCount || 0) + 1;
      
      const updatedWallet = walletSystem.getOrCreateWallet(user);
      updateProfile({ publishedItems: [...(user.publishedItems || []), newItem], publisherStats: newStats, wallet: updatedWallet });
      
      return { success: true };
  };

  const createProduct = (productData: any) => {
      if(!user) return { success: false, error: 'Not logged in' };
      if (!IronDome.Firewall.inspect(productData.description, 'Product Create')) {
          return { success: false, error: 'Security Violation' };
      }
      const isShadowBanned = governance.isShadowBanned(user);
      const initialStatus = productData.status || 'active';
      const status = isShadowBanned ? 'shadow_banned' : initialStatus;
      const newProduct: ProductListing = { ...productData, id: `prod_${Date.now()}`, sellerId: user.id, sellerName: user.name, sellerAvatar: user.avatar, sellerVerified: user.isIdentityVerified, sellerRating: 0, sellerJoinDate: new Date().toISOString(), status: status, views: 0, contactClicks: 0, isSuspicious: false, createdAt: new Date().toISOString() };
      const updatedProducts = [newProduct, ...allProducts];
      setAllProducts(updatedProducts);
      localStorage.setItem('allProducts', JSON.stringify(updatedProducts));
      return { success: true };
  };

  const markProductAsSold = (id: string) => {
      const updated = allProducts.map(p => p.id === id ? { ...p, status: 'sold' } : p);
      setAllProducts(updated as ProductListing[]);
      localStorage.setItem('allProducts', JSON.stringify(updated));
      const product = allProducts.find(p => p.id === id);
      const isPrime = subscriptionCore.hasAccess(user, 'ZeroCommission');
      if (product && user && !isPrime) {
          const commission = CommissionEngine.calculateCommission(product.price, product.category);
          sendSystemNotification(user.id, 'عمولة مستحقة', `يرجى سداد عمولة بيع ${product.title} بقيمة ${commission} ريال.`, 'financial');
      } else if (product && user && isPrime) {
          sendSystemNotification(user.id, 'تهانينا!', `تم بيع ${product.title}. استمتعت بـ 0% عمولة بفضل عضويتك في Elite.`, 'success');
      }
  };

  const submitExamResult = (courseId: string, courseName: string, score: number, unlockPermission?: string) => {
      if(!user) return;
      const grade = score >= 90 ? 'A' : score >= 80 ? 'B' : 'C';
      
      // 1. Generate Certificate
      const newCert: Certificate = {
          id: `crt_${Date.now()}`,
          userId: user.id,
          courseId,
          courseName,
          finalScore: score,
          grade,
          hours: 10,
          issuedAt: new Date().toISOString(),
          trainingNumber: user.trainingId || 'STU-000',
          provider: 'Mylaf Academy',
          verifyCode: `V-${Math.floor(Math.random()*10000)}`,
          type: 'Course'
      };

      // 2. Add to Transcript
      const newTranscriptEntry: TranscriptEntry = {
          courseId,
          courseName,
          score,
          grade,
          creditHours: 3,
          completionDate: new Date().toISOString(),
          semester: 'Fall 2025'
      };

      // 3. Handle Permission Unlock
      let newPermissions = user.permissions || [];
      if (unlockPermission && !newPermissions.includes(unlockPermission)) {
          newPermissions.push(unlockPermission);
          sendSystemNotification(user.id, "ترقية الصلاحيات", `تهانينا! لقد فتحت صلاحية جديدة: ${unlockPermission}`, "success");
      }

      // 4. Update Profile
      const currentCertificates = user.certificates || [];
      const currentTranscript = user.transcript || [];
      
      updateProfile({
          certificates: [newCert, ...currentCertificates],
          transcript: [newTranscriptEntry, ...currentTranscript],
          permissions: newPermissions,
          xp: (user.xp || 0) + 500 // Elite Points
      });
  };

  const createService = (d:any) => { if(!user)return{success:false,error:'Login'}; const s={...d,id:`s_${Date.now()}`,sellerId:user.id,sellerName:user.name,sellerAvatar:user.avatar,status:'active',rating:0,sales:0,createdAt:new Date().toISOString()}; setAllServices([s,...allServices]); localStorage.setItem('mylaf_services',JSON.stringify([s,...allServices])); return {success:true}; };
  const createJob = (j:any) => { const n={...j,id:`j_${Date.now()}`,createdAt:new Date().toISOString()}; setAllJobs([n,...allJobs]); localStorage.setItem('allJobs',JSON.stringify([n,...allJobs])); return true; };
  const addAcademicProject = (p:any) => { if(!user)return false; updateProfile({academicProjects:[...(user.academicProjects||[]),{id:`p_${Date.now()}`,...p,status:'approved',paymentStatus:'paid',createdAt:new Date().toISOString()}]}); return true; };
  const searchContent = (q:string) => ({services:allServices.filter(s=>s.title.includes(q)),jobs:allJobs.filter(j=>j.title.includes(q))});
  const incrementProductViews = (id:string) => { setAllProducts(allProducts.map(p=>p.id===id?{...p,views:(p.views||0)+1}:p)); };
  const purchaseService = (item:any, txn:any) => {
      if(!user) return {success:false,error:'User'};
      if(txn.receiptFile) { financeCore.submitBankTransfer({userId:user.id,userName:user.name,serviceTitle:item.title,amount:item.price,receiptFile:txn.receiptFile,category:'Market'}); const t:Transaction={id:txn.id,serviceTitle:item.title,buyerId:user.id,buyerName:user.name,sellerId:item.sellerId,sellerName:item.sellerName,amount:item.price,total:item.price,status:'pending_verification',createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()}; setMyTransactions([t,...myTransactions]); return{success:true};}
      const t:Transaction={id:txn.id,serviceTitle:item.title,buyerId:user.id,buyerName:user.name,sellerId:item.sellerId,sellerName:item.sellerName,amount:item.price,total:item.price,status:'in_progress',createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()}; setMyTransactions([t,...myTransactions]); InvoiceSystem.generateInvoice(user.id,[{description:`Purchase: ${item.title}`,amount:item.price}]); return{success:true};
  };
  const placeBid = (pid:string,amt:number) => { return {success:true} }; 
  const confirmReceipt = (id:string) => setMyTransactions(myTransactions.map(t=>t.id===id?{...t,status:'completed'}:t));
  const markDelivered = (id:string) => setMyTransactions(myTransactions.map(t=>t.id===id?{...t,status:'delivered'}:t));
  const rateTransaction = () => {};
  const enrollCourse = (c:Course) => { 
      if(user) {
          // Check if already enrolled
          if(user.enrolledCourses?.some(ec => ec.courseId === c.id)) return;
          updateProfile({enrolledCourses:[...(user.enrolledCourses||[]),{courseId:c.id, progress:0, status:'active', lastAccessed:new Date().toISOString()}]}); 
      }
  };
  const updateCourseProgress = (courseId: string, progress: number) => {
      if (!user || !user.enrolledCourses) return;
      const updated = user.enrolledCourses.map(c => c.courseId === courseId ? { ...c, progress } : c);
      updateProfile({ enrolledCourses: updated });
  };
  const completeCourse = (c:Course,s:number,g:string) => { 
      if(user) {
          // Legacy call - redirects to submitExamResult
          submitExamResult(c.id, c.title, s);
      }
  };
  const submitAssignment = () => {};
  const markAttendance = () => {};
  const submitCVRequest = (r:any) => { if(user) updateProfile({cvRequests:[...(user.cvRequests||[]),{id:`cv_${Date.now()}`,userId:user.id,status:'completed',createdAt:new Date().toISOString(),...r}]}); };
  const startReadingBook = () => {};
  const updateBookProgress = () => {};
  const generateCourse = async () => null;
  const runAIAnalysis = async () => {};
  const submitIdentityVerification = async () => ({success:true});
  const updateAdminConfig = (c:any) => setAdminConfig({...adminConfig,...c});
  const generateBackup = () => JSON.stringify({});
  const restoreBackup = () => true;
  const getSystemAnalytics = () => ({usersCount:storedUsers.length,totalRevenue:0,certificatesIssued:0,activeCourses:0});
  const checkProfileCompleteness = () => 100;
  const verifyUserAttribute = async () => true;
  const updateIBAN = () => ({success:true});
  const createSupportTicket = (t:SupportTicket) => { if(user) updateProfile({supportTickets:[...(user.supportTickets||[]),t]}); return true; };
  const followUser = (id:string) => { if(user) updateProfile({following:[...(user.following||[]),id]}); };
  const unfollowUser = (id:string) => { if(user) updateProfile({following:(user.following||[]).filter(f=>f!==id)}); };
  const createStory = (m:string,t:any,o:any,b:boolean) => { if(user) storyEngine.createStory(user,m,t,o,b); };
  
  const login = async (d:any, p?:string) => {
      const existing = storedUsers.find(u => u.email === d.email);
      if(existing && p) {
          const h = await RealAuthService.hashPassword(p);
          if(existing.passwordHash === h) {
              if (!existing.ecosystem) {
                  existing.ecosystem = {
                      academy: { level: 1, xp: 0, certificatesCount: 0, activeCourses: 0, lastActive: new Date().toISOString(), gpa: 0 },
                      market: { balance: 0, activeServices: 0, totalSales: 0, rating: 5.0 },
                      jobs: { profileCompleteness: 70, applicationsCount: 0, profileViews: 0, savedJobs: 0 },
                      haraj: { activeAds: 0, soldItems: 0, reputationScore: 100, isVerifiedMerchant: false }
                  };
              }
              const u = {...existing, isLoggedIn:true};
              u.wallet = walletSystem.getOrCreateWallet(u);
              setUser(u);
              accessGate.persistSession(u);
              IronDome.SessionGuard.bindSession();
              return {success:true};
          }
      }
      return {success:false, error:"Invalid credentials"};
  };
  const register = async (d:any) => {
      const u = {...d, id:`u_${Date.now()}`, isLoggedIn:true, role:'student', karma:500} as User;
      u.wallet = walletSystem.getOrCreateWallet(u);
      setUser(u);
      accessGate.persistSession(u);
      IronDome.SessionGuard.bindSession();
      return {success:true};
  };
  const logout = () => { setUser(null); localStorage.removeItem('fluid_session_v1'); localStorage.removeItem('mylaf_session'); };
  const resetPassword = async () => true;
  const addManualJob = (j:any) => setManualJobs([j,...manualJobs]);
  const editManualJob = (id:string,j:any) => setManualJobs(manualJobs.map(m=>m.id===id?{...m,...j}:m));
  const deleteManualJob = (id:string) => setManualJobs(manualJobs.filter(m=>m.id!==id));

  return (
    <AuthContext.Provider value={{ 
        user, login, register, logout, resetPassword, updateProfile, isAuthenticated: !!user, checkProfileCompleteness, verifyUserAttribute, updateIBAN, submitIdentityVerification,
        signInWithGoogle, // Exported for AuthModal
        createService, createProduct, createJob, addAcademicProject, searchContent, markProductAsSold, incrementProductViews,
        allServices, allProducts, allJobs, storedUsers,
        enrollCourse, updateCourseProgress, completeCourse, submitAssignment, markAttendance, submitExamResult,
        startReadingBook, updateBookProgress,
        myTransactions, purchaseService, placeBid, markDelivered, confirmReceipt, rateTransaction,
        notifications, markNotificationRead, sendSystemNotification,
        adminConfig, updateAdminConfig, generateBackup, restoreBackup, getSystemAnalytics,
        generateCourse, runAIAnalysis, aiGeneratedCourses,
        submitCVRequest, publishUserContent,
        manualJobs, addManualJob, editManualJob, deleteManualJob,
        isAdmin, adminLogin, adminLogout,
        createSupportTicket,
        followUser, unfollowUser,
        brain, healer,
        walletSystem, pricingAI, depositToWallet,
        createStory,
        governance,
        joinPrime, checkUpsellTrigger,
        requireAuth, showLoginModal, setShowLoginModal
    }}>
      {children}
    </AuthContext.Provider>
  );
};
