
export enum Role {
  USER = 'user',
  MODEL = 'model'
}

export type UserRole = 'admin' | 'trainer' | 'student' | 'supervisor' | 'business';
export type LoginProvider = 'google' | 'facebook' | 'twitter' | 'github' | 'yahoo' | 'microsoft' | 'apple' | 'nafath' | 'email' | 'system' | 'google.com' | 'github.com' | 'facebook.com' | 'microsoft.com' | 'yahoo.com';

export interface AuthProviderData {
  providerId: string;
  uid: string;
  displayName?: string;
  email?: string;
  phoneNumber?: string;
  photoURL?: string;
}

export interface PrivacySettings {
    showPhone: boolean;
    showEmail: boolean;
    showGoogle?: boolean;
    showGithub?: boolean;
    showYahoo?: boolean;
    showMicrosoft?: boolean;
}

export interface TitanDNA {
  archetype: 'Scholar' | 'Trader' | 'Freelancer' | 'Commander';
  learningIQ: number;
  marketTrust: number;
  walletTier: 'Bronze' | 'Silver' | 'Gold';
  riskFactor: number;
}

export interface CRMUserExtension {
  leadScore: number;
  tags: string[];
  lifecycleStage: string;
  lastAction: string;
  totalSpend: number;
}

export type TransactionType = 'DEPOSIT' | 'WITHDRAWAL' | 'PURCHASE' | 'COMMISSION' | 'REFUND' | 'SUBSCRIPTION';

export interface LedgerEntry {
  id: string;
  transactionId: string;
  walletId: string;
  type: 'CREDIT' | 'DEBIT';
  amount: number;
  balanceAfter: number;
  description: string;
  timestamp: string;
}

export interface Wallet {
  id: string;
  userId: string;
  balance: number;
  currency: string;
  status: 'active' | 'frozen';
  ledger: LedgerEntry[];
  lastUpdated: string;
}

export interface PrimeSubscription {
  status: 'active' | 'canceled' | 'expired';
  tier: 'Elite';
  startDate: string;
  nextBillingDate: string;
  autoRenew: boolean;
  price: number;
  benefits: {
      marketCommission: number;
      jobBoosting: boolean;
      premiumCourses: number;
      logisticsDiscount: number;
  };
  discountApplied?: boolean;
}

export interface BusinessProfile {
  companyName: string;
  industry: string;
  location: { city: string; address: string };
  workingHours: string;
  website?: string;
  logoUrl: string;
  coverVideoUrl?: string;
  description: string;
  verified: boolean;
}

export interface ViralStats {
  totalClicks: number;
  totalSignups: number;
  totalEarnings: number;
  pendingPayout: number;
  affiliateCode: string;
  campaigns?: any[];
}

export interface StoryOverlay {
  type: 'PRICE' | 'JOB';
  text: string;
  x: number;
  y: number;
}

export interface Story {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  duration: number;
  overlays: StoryOverlay[];
  createdAt: string;
  expiresAt: string;
  views: number;
  isBoosted: boolean;
  swipeLink?: string;
}

export interface SupportTicket {
  id: string;
  userId: string;
  subject: string;
  issue: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  status: 'Open' | 'In Progress' | 'Closed';
  createdAt: string;
  category: string;
  autoSummary: string;
}

export interface EcosystemProfile {
  // Placeholder
}

export interface TranscriptEntry {
  courseId: string;
  courseName: string;
  creditHours: number;
  grade: string;
  score: number;
  completionDate: string;
  semester: string;
}

export interface SecurityLog {
  // Placeholder
}

export interface KYCData {
  provider: string;
  status: string;
  verifiedAt: string;
  ageVerified: boolean;
  documentType: string;
  facialMatchScore: number;
  transactionId: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  startYear?: string;
  endYear?: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  startYear?: string;
  endYear?: string;
  description?: string;
}

export interface Language {
  // Placeholder
}

export interface CustomField {
  // Placeholder
}

export interface AIAnalysisResult {
  // Placeholder
}

export type ServiceCategory = 'Design' | 'Programming' | 'Writing' | 'Marketing' | 'Video' | 'Consulting';

export interface ServiceListing {
  id: string;
  title: string;
  description: string;
  price: number;
  category: ServiceCategory;
  thumbnail: string;
  sellerId: string;
  sellerName: string;
  sellerAvatar: string;
  rating: number;
  deliveryTime: string;
  status: string;
}

export interface Applicant {
  id: string;
  userId: string;
  name: string;
  avatar: string;
  jobTitle: string;
  skills: string[];
  experienceYears: number;
  appliedAt: string;
  status: 'New' | 'Interview' | 'Shortlisted' | 'Hired';
  contactUnlocked: boolean;
}

export interface UserJob {
  id: string;
  title: string;
  company: string;
  location: string;
  date: string;
  description: string;
  type: string;
  source?: string;
  isOfficial?: boolean;
  logoUrl?: string;
  isFeatured?: boolean;
  applicants?: Applicant[];
  url?: string;
  isSmartSuggestion?: boolean;
  score?: number;
}

export type TransactionStatus = 'pending_verification' | 'completed' | 'rejected' | 'in_progress' | 'delivered';

export interface Transaction {
  id: string;
  serviceTitle: string;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  sellerName: string;
  amount: number;
  total?: number;
  status: TransactionStatus;
  paymentMethod?: string;
  receiptUrl?: string;
  receiptHash?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CVRequest {
  id: string;
  status: string;
  createdAt: string;
  // ... other fields
}

export interface PublishedContent {
  id: string;
  type: 'Course' | 'Project' | 'Service';
  title: string;
  status: string;
  createdAt: string;
  price: number;
}

export interface AcademicProject {
  id: string;
  title: string;
  status: string;
  createdAt: string;
  // ...
}

export interface EnrolledCourse {
  courseId: string;
  progress: number;
  status: 'active' | 'completed';
  lastAccessed: string;
}

export interface ReadBook {
  // Placeholder
}

export interface Certificate {
  id: string;
  userId: string;
  courseName: string;
  trainingNumber: string;
  finalScore: number;
  grade: string;
  hours: number;
  issuedAt: string;
  provider: string;
  verifyCode: string;
  type: 'Course' | 'Project';
}

export interface AssignmentSubmission {
  // Placeholder
}

export interface ExamAttempt {
  examId: string;
  status: 'passed' | 'failed';
  score: number;
  date: string;
}

export interface UserInteraction {
  // Placeholder
}

export interface Achievement {
  // Placeholder
}

export interface Badge {
  // Placeholder
}

export interface Notification {
  id: string;
  userId: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'financial' | 'like' | 'follow' | 'reply' | 'mention';
  title: string;
  message: string;
  isRead: boolean;
  date: string;
  actorName?: string;
  actorAvatar?: string;
  content?: string;
  postId?: string;
}

export interface User {
  id: string;
  name: string;
  username?: string;
  email?: string;
  passwordHash?: string; 
  phone?: string;
  nationalId?: string;
  trainingId?: string; 
  role: UserRole;
  permissions?: string[]; 
  avatar?: string;
  coverImage?: string; 
  isLoggedIn: boolean;
  loginMethod: LoginProvider;
  verified: boolean; 
  isGold?: boolean;
  isVerified?: boolean; // Sometimes used interchangeably with verified
  linkedProviders: string[]; // Changed from LoginProvider[] to allow string array from Firestore
  providerData?: AuthProviderData[]; 
  createdAt: string;
  lastLogin: string;
  authToken?: string;
  joinDate?: string;
  
  // NEW PRIVACY & CONNECTED ACCOUNTS
  privacy?: PrivacySettings;
  providerEmails?: Record<string, string>; 
  
  // --- VERIFICATION FLAGS (Like Khamsat) ---
  isPhoneVerified?: boolean;
  isEmailVerified?: boolean;
  isIdentityVerified?: boolean; 
  isGithubVerified?: boolean; // Verified via GitHub
  isYahooVerified?: boolean; // Verified via Yahoo
  isGoogleVerified?: boolean; // Verified via Google
  isMicrosoftVerified?: boolean; // Verified via Microsoft
  // -----------------------------------------

  citizenshipId?: string; 
  karma?: number; 
  credibilityLikes?: number;
  credibilityDislikes?: number;
  
  titanDNA?: TitanDNA;
  crmData?: CRMUserExtension;
  wallet?: Wallet;
  primeSubscription?: PrimeSubscription;
  businessProfile?: BusinessProfile;
  followers?: string[]; 
  following?: string[]; 
  followersCount?: number;
  followingCount?: number;
  viralStats?: ViralStats;
  stories?: Story[];
  supportTickets?: SupportTicket[];
  ecosystem?: EcosystemProfile;
  transcript?: TranscriptEntry[];
  customFormFields?: Record<string, string>; 

  gender?: 'Male' | 'Female';
  birthDate?: string;
  bloodType?: string; 
  maritalStatus?: string;
  nationality?: string; 
  passportId?: string; 
  academicStatus?: 'New' | 'Active' | 'Graduated' | 'Suspended'; 
  country?: string;
  city?: string;
  address?: string;
  
  qualification?: string; 
  university?: string; 
  previousInstitution?: string;
  previousQualifications?: string[];
  graduationYear?: string;
  major?: string;
  region?: string; 

  employmentStatus?: string;
  employmentSector?: string;
  yearsOfExperience?: string;
  currentJobTitle?: string;

  failedLoginAttempts?: number;
  lockoutUntil?: string;
  securityLogs?: SecurityLog[];
  
  kycStatus?: 'none' | 'pending' | 'verified';
  isBiometricVerified?: boolean;
  kycData?: KYCData; 
  iban?: string; 

  bio?: string;
  education?: Education[];
  experience?: Experience[];
  skills?: string[];
  languages?: Language[];
  customFields?: CustomField[];
  isReadyToWork?: boolean;
  profileCompleteness?: number;
  isPhoneHidden?: boolean; 
  aiAnalysis?: AIAnalysisResult;

  walletBalance?: number; // Shortcut
  myServices?: ServiceListing[];
  myJobs?: UserJob[];
  transactions?: Transaction[];
  cvRequests?: CVRequest[];

  publishedItems?: PublishedContent[];
  publisherStats?: {
      coursesCount: number;
      projectsCount: number;
      servicesCount: number;
      totalSales: number;
      rating: number;
  };

  academicProjects?: AcademicProject[];
  enrolledCourses?: EnrolledCourse[];
  readBooks?: ReadBook[];
  certificates?: Certificate[];
  submissions?: AssignmentSubmission[];
  examAttempts?: ExamAttempt[];
  notifications?: Notification[];

  interactions?: UserInteraction[];
  achievements?: Achievement[];
  badges?: Badge[]; 
  
  xp: number;
  level: number; 
  nextLevelXp: number;
  studentLevelTitle?: string;
}

export interface RegistrationData {
  name: string;
  email: string;
  password?: string;
  phone: string;
  nationalId?: string;
  passportId?: string;
  address?: string;
  region?: string;
  country?: string;
  city?: string;
  gender?: string;
  birthDate?: string;
  avatar?: string;
  qualification?: string;
  major?: string;
  previousInstitution?: string;
  previousQualifications?: string[];
  graduationYear?: string;
  employmentStatus?: string;
  verified?: boolean;
  loginMethod?: LoginProvider;
}

export interface NafathResponse {
  transId: string;
  random: string;
  status: string;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: Partial<User>;
  error?: string;
}

// --- Messaging ---
export interface Attachment {
  type: 'image' | 'audio';
  data: string; // base64
  mimeType: string;
  url?: string;
}

export interface SearchSource {
  uri: string;
  title: string;
}

export interface Message {
  id: string;
  role: Role;
  content: string;
  attachment?: Attachment;
  isStreaming?: boolean;
  sources?: SearchSource[];
  ticketId?: string; // for system messages
  isTicket?: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'bot' | 'system';
  text: string;
  timestamp: string;
  isTicket?: boolean;
  ticketId?: string;
}

// --- Content & Marketplace ---
export interface Book {
  id: string;
  title: string;
  // ...
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  videoUrl: string;
  durationSeconds: number;
  orderIndex: number;
}

export type CourseCategory = 'AI' | 'Cybersecurity' | 'Web' | 'Mobile' | 'Data' | 'Business' | 'Design' | 'Finance' | 'Management' | 'Marketing' | 'General' | 'Programming';

export interface Course {
  id: string;
  title: string;
  description: string;
  hours: number;
  skillLevel: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  thumbnail: string;
  category: CourseCategory;
  provider: string;
  skills: string[];
  lessons: Lesson[];
  status: 'active' | 'archived';
  youtubePlaylistId?: string;
  lastSyncedAt?: string;
  aiScore?: number;
  dropOffRate?: number;
}

export interface Review {
    id: string;
    reviewerName: string;
    reviewerAvatar?: string;
    rating: number;
    comment: string;
    date: string;
    reply?: string;
}

export interface CourseExtended extends Course {
    modules?: any[]; // using any for flexibility in rendering components
    reviews?: Review[];
}

export interface CourseAnalytics {
  courseId: string;
  views: number;
  completions: number;
  totalWatchTime: number;
  bounces: number;
  dropOffPoints: number[];
}

export interface SQL_UserBehavior {
  id: string;
  user_id: string;
  course_id: string;
  action_type: 'view' | 'hover' | 'video_start' | 'video_pause' | 'video_complete';
  duration_seconds: number;
  timestamp: string;
  meta_data?: string;
}

export interface SQL_CourseScore {
    // Placeholder
}

export type ProductCategory = 'Cars' | 'RealEstate' | 'Devices' | 'Animals' | 'Furniture' | 'Services' | 'Digital' | 'Physical' | 'General';
export type ProductCondition = 'New' | 'Used - Like New' | 'Used - Good' | 'Used - Fair' | 'Refurbished';
export type AuctionType = 'Fixed' | 'Auction';

export interface ProductListing {
    id: string;
    sellerId: string;
    sellerName: string;
    sellerAvatar: string;
    sellerVerified?: boolean;
    title: string;
    description: string;
    price: number;
    images: string[];
    category: ProductCategory;
    subCategory?: string; // e.g. Toyota
    condition?: ProductCondition;
    location: string;
    type: AuctionType;
    status: 'active' | 'sold' | 'pending_payment' | 'review' | 'shadow_banned';
    tags: string[];
    views?: number;
    isNegotiable?: boolean;
    createdAt: string;
    rating?: number;
}

export interface ExamQuestion {
    id: string;
    text: string;
    type: 'mcq' | 'text';
    points: number;
    correctAnswer: string;
    options: string[];
}

export interface Invoice {
    id: string;
    transactionId: string;
    userId: string;
    items: { description: string; amount: number }[];
    subtotal: number;
    vatAmount: number;
    total: number;
    status: 'paid' | 'unpaid';
    issueDate: string;
    reminded_1h?: boolean;
    reminded_24h?: boolean;
}

// --- Sentinel & Empire ---
export type SentinelState = 'IDLE' | 'CLASSIFYING' | 'INTERROGATING_TECH' | 'INTERROGATING_FINANCE' | 'INTERROGATING_SCAM' | 'RESOLVING' | 'ESCALATING';
export type SentinelIntent = 'TECH_ISSUE' | 'FINANCIAL_ISSUE' | 'SCAM_REPORT' | 'GENERAL';

// --- Titan ---
export interface TitanBlock {
    index: number;
    timestamp: string;
    type: 'SYSTEM_EVENT' | 'FINANCIAL' | 'SECURITY';
    data: any;
    previousHash: string;
    hash: string;
    signature: string;
}

export interface ShadowReport {
    generatedAt: string;
    systemHealth: number;
    integrityStatus: 'SECURE' | 'COMPROMISED';
    blocksVerified: number;
    threatsBlocked: number;
    revenueToday: number;
    actionRequired: boolean;
}

// --- Expansion & Viral ---
export interface ReferralLog {
    id: string;
    refCode: string;
    targetId: string;
    timestamp: string;
    converted: boolean;
    commissionEarned: number;
}

export interface PayoutRequest {
    // Placeholder
}

// --- Governance ---
export interface TribunalCase {
    id: string;
    plaintiffId: string;
    plaintiffName: string;
    defendantId: string;
    defendantName: string;
    productId: string;
    description: string;
    evidence: string[];
    createdAt: string;
    status: 'Open' | 'Closed';
    votes: { jurorId: string, verdict: TribunalVerdict, timestamp: string }[];
    jurors: string[];
    finalVerdict: 'Pending' | 'Guilty' | 'Innocent';
}

export type TribunalVerdict = 'Guilty' | 'Innocent';

// --- Darwin ---
export interface EvolutionLog {
    id: string;
    feature: string;
    trigger: string;
    deployedAt: string;
    status: 'LIVE';
}

// --- Constitution ---
export interface ConstitutionLaw {
    id: string;
    clause: string;
    type: 'FINANCIAL' | 'OPERATIONAL' | 'SECURITY';
    value: number;
    isImmutable: boolean;
    active: boolean;
}

export interface ReserveFund {
    balance: number;
    transactions: { date: string, amount: number, source: string }[];
}

// --- Reality ---
export interface Shipment {
    id: string;
    trackingNumber: string;
    senderId: string;
    receiverId: string;
    fromCity: string;
    toCity: string;
    status: 'Pending' | 'In Transit' | 'Delivered';
    cost: number;
    labelUrl: string;
}

export interface Appointment {
    id: string;
    hostId: string;
    guestId: string;
    type: 'Interview' | 'Service';
    date: string;
    timeSlot: string;
    meetingLink?: string;
    status: 'Confirmed' | 'Cancelled';
}

export interface LegalContract {
    id: string;
    type: 'JobOffer' | 'BillOfSale';
    partyA: string;
    partyB: string;
    terms: any;
    signedA: boolean;
    signedB: boolean;
    createdAt: string;
}
