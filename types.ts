

export enum Role {
  USER = 'user',
  MODEL = 'model'
}

export type UserRole = 'admin' | 'trainer' | 'student' | 'supervisor' | 'business';

// --- LMS TYPES ---
export interface CourseModule {
    id: string;
    title: string;
    type: 'video' | 'pdf' | 'quiz' | 'assignment';
    duration: string; // e.g. "10:00"
    isCompleted: boolean;
    resourceUrl?: string;
}

export interface TranscriptEntry {
    courseId: string;
    courseName: string;
    creditHours: number;
    grade: string; // A, B, C, F
    score: number; // 0-100
    completionDate: string;
    semester: string;
}

export interface CourseExtended extends Course {
    modules?: CourseModule[];
    unlocksPermission?: string; // e.g., 'sell_marketing'
}
// --- END LMS TYPES ---

// --- MEGA ECOSYSTEM DATA STRUCTURE (NEW) ---
export interface AcademyTrack {
    level: number;
    xp: number;
    certificatesCount: number;
    activeCourses: number;
    lastActive: string;
    gpa: number; // Added GPA
}

export interface MarketTrack {
    balance: number;
    activeServices: number;
    totalSales: number;
    rating: number;
}

export interface JobsTrack {
    profileCompleteness: number;
    applicationsCount: number;
    profileViews: number;
    savedJobs: number;
}

export interface HarajTrack {
    activeAds: number;
    soldItems: number;
    reputationScore: number;
    isVerifiedMerchant: boolean;
}

export interface EcosystemProfile {
    academy: AcademyTrack;
    market: MarketTrack;
    jobs: JobsTrack;
    haraj: HarajTrack;
}
// --- END MEGA ECOSYSTEM ---

export interface PrimeSubscription {
  status: 'active' | 'canceled' | 'expired';
  tier: 'Elite' | 'Standard';
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
  transactions: {
    date: string;
    amount: number;
    source: string;
  }[];
}

export interface EvolutionLog {
  id: string;
  feature: string;
  trigger: string;
  deployedAt: string;
  status: string;
}

export interface TitanBlock {
  index: number;
  timestamp: string;
  type: 'CERTIFICATE' | 'TRANSACTION' | 'SYSTEM_EVENT';
  data: any;
  previousHash: string;
  hash: string;
  signature: string; 
}

export interface TitanDNA {
  archetype: 'Scholar' | 'Trader' | 'Freelancer' | 'Commander';
  learningIQ: number; 
  marketTrust: number; 
  walletTier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Black';
  riskFactor: number; 
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

export interface CRMUserExtension {
  leadScore: number;
  tags: string[]; 
  lifecycleStage: 'New' | 'Active' | 'Churned' | 'Loyal';
  lastAction: string;
  totalSpend: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'bot' | 'system';
  text: string;
  timestamp: string;
  isTicket?: boolean;
  ticketId?: string;
  attachment?: string;
}

export interface SupportTicket {
  id: string;
  userId: string;
  subject: string;
  issue: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  status: 'Open' | 'Resolved' | 'Escalated' | 'Closed';
  createdAt: string;
  category: string;
  autoSummary?: string; 
}

export type SentinelState = 'IDLE' | 'CLASSIFYING' | 'INTERROGATING_TECH' | 'INTERROGATING_FINANCE' | 'INTERROGATING_SCAM' | 'RESOLVING' | 'ESCALATING';

export interface SentinelIntent {
  type: 'TECH' | 'FINANCE' | 'SCAM' | 'GENERAL' | 'UNKNOWN';
  confidence: number;
  keywords: string[];
}

export interface MarketingCampaign {
  id: string;
  trigger: 'signup' | 'abandoned_cart' | 'inactive';
  channel: 'email' | 'whatsapp' | 'notification';
  content: string;
}

export type TransactionType = 'DEPOSIT' | 'WITHDRAWAL' | 'PURCHASE' | 'REFUND' | 'COMMISSION' | 'TRANSFER' | 'REFERRAL_BONUS' | 'SUBSCRIPTION' | 'RESERVE_TAX';
export type TransactionStatus = 'pending' | 'completed' | 'failed' | 'reversed' | 'pending_payment' | 'in_progress' | 'delivered' | 'cancelled' | 'disputed' | 'pending_verification' | 'rejected';

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

export interface Invoice {
  id: string;
  transactionId: string;
  userId: string;
  items: { description: string; amount: number }[];
  subtotal: number;
  vatAmount: number; 
  total: number;
  status: 'paid' | 'unpaid' | 'void';
  issueDate: string;
  pdfUrl?: string; 
}

export interface CommissionRule {
  categoryId: string; 
  percentage: number; 
  cap?: number; 
}

export interface Shipment {
    id: string;
    trackingNumber: string;
    senderId: string;
    receiverId: string;
    fromCity: string;
    toCity: string;
    status: 'Pending' | 'Shipped' | 'InTransit' | 'Delivered';
    cost: number;
    labelUrl?: string;
}

export interface Appointment {
    id: string;
    hostId: string;
    guestId: string;
    type: 'Interview' | 'Service';
    date: string;
    timeSlot: string;
    meetingLink?: string; 
    status: 'Confirmed' | 'Cancelled' | 'Completed';
}

export interface LegalContract {
    id: string;
    type: 'JobOffer' | 'BillOfSale' | 'ServiceAgreement';
    partyA: string; 
    partyB: string; 
    terms: any; 
    signedA: boolean;
    signedB: boolean;
    pdfUrl?: string;
    createdAt: string;
}

export interface StoryOverlay {
    type: 'PRICE' | 'JOB' | 'LOCATION';
    text: string;
    x: number; 
    y: number; 
    data?: any; 
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
    isBoosted?: boolean; 
    swipeLink?: string; 
    swipeText?: string; 
}

export interface ReferralLog {
    id: string;
    refCode: string; 
    targetId: string; 
    timestamp: string;
    converted: boolean; 
    commissionEarned: number;
}

export interface PayoutRequest {
    id: string;
    userId: string;
    amount: number;
    method: 'WALLET' | 'BANK';
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    requestDate: string;
    processedDate?: string;
    bankDetails?: string; 
}

export interface ViralStats {
    affiliateCode: string;
    totalClicks: number;
    totalSignups: number;
    totalEarnings: number;
    pendingPayout: number; 
    campaigns: ReferralLog[];
    payoutHistory?: PayoutRequest[];
}

export interface BusinessProfile {
    companyName: string;
    industry: string;
    logoUrl: string;
    coverVideoUrl?: string; 
    description: string;
    location: {
        lat: number;
        lng: number;
        address: string;
        city: string;
    };
    workingHours: string; 
    team: string[]; 
    website?: string;
    verified: boolean;
}

export type ApplicantStatus = 'New' | 'Interview' | 'Shortlisted' | 'Hired' | 'Rejected';

export interface Applicant {
    id: string;
    userId: string;
    name: string;
    avatar: string;
    jobTitle: string; 
    skills: string[];
    experienceYears: number;
    appliedAt: string;
    status: ApplicantStatus;
    notes?: string;
    resumeUrl?: string;
    contactUnlocked: boolean; 
}

export type TribunalVerdict = 'Guilty' | 'Innocent' | 'Pending';

export interface TribunalCase {
    id: string;
    plaintiffId: string; 
    plaintiffName: string;
    defendantId: string; 
    defendantName: string; 
    productId?: string; 
    description: string;
    evidence: string[]; 
    createdAt: string;
    status: 'Open' | 'Closed';
    votes: {
        jurorId: string;
        verdict: TribunalVerdict;
        timestamp: string;
    }[];
    jurors: string[]; 
    finalVerdict?: TribunalVerdict;
}

export interface MentorshipSession {
    id: string;
    mentorId: string;
    menteeId: string;
    topic: string;
    status: 'Pending' | 'Scheduled' | 'Completed';
    price: number;
    date?: string;
}

export interface BarterDeal {
    id: string;
    partyA: string;
    partyB: string;
    offerA: string; 
    offerB: string; 
    status: 'Proposed' | 'Accepted' | 'Completed';
    feePaid: boolean;
}

export interface SynapseMatch {
    userId: string;
    userName: string;
    avatar: string;
    matchReason: string; 
    type: 'Owner' | 'Expert' | 'Peer';
    similarity: number; 
}

export interface SQL_UserBehavior {
  id: string;
  user_id: string;
  course_id: string;
  action_type: 'view' | 'hover' | 'video_start' | 'video_pause' | 'video_complete' | 'scroll_past';
  duration_seconds: number;
  timestamp: string;
  meta_data?: string; 
}

export interface SQL_CourseScore {
  course_id: string;
  total_views: number;
  total_completions: number;
  avg_watch_time_sec: number;
  bounce_rate_pct: number;
  ai_relevance_score: number; 
  last_updated: string;
}

export interface CourseAnalytics {
  courseId: string;
  views: number;
  completions: number;
  totalWatchTime: number;
  bounces: number; 
  dropOffPoints: number[]; 
}

export interface SearchSource {
  uri: string;
  title: string;
}

export interface Attachment {
  type: 'image' | 'audio';
  data: string; 
  mimeType: string;
  url?: string; 
}

export interface Message {
  id: string;
  role: Role;
  content: string;
  isStreaming?: boolean;
  sources?: SearchSource[];
  attachment?: Attachment;
  isToolCall?: boolean;
  toolName?: string;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}

export type LoginProvider = 'nafath' | 'otp' | 'email' | 'apple' | 'twitter' | 'facebook' | 'google' | 'microsoft' | 'instagram' | 'github';

export interface Notification {
  id: string;
  userId: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'system' | 'financial'; 
  title: string;
  message: string;
  isRead: boolean;
  date: string;
  actionUrl?: string;
  metadata?: any; 
}

export interface Department {
  id: string;
  name: string;
  headId: string; 
  description: string;
}

export interface LearningTrack {
  id: string;
  title: string;
  departmentId: string;
  courseIds: string[];
  description: string;
}

export interface LiveSession {
  id: string;
  courseId: string;
  title: string;
  instructorName: string;
  date: string;
  durationMinutes: number;
  platform: 'Zoom' | 'Meet' | 'Teams';
  joinUrl: string;
  isRecorded: boolean;
  recordingUrl?: string;
  attendees: string[]; 
}

export interface Assignment {
  id: string;
  courseId: string;
  title: string;
  description: string;
  dueDate: string;
  totalPoints: number;
}

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  userId: string;
  fileUrl?: string;
  submittedAt: string;
  grade?: number;
  feedback?: string;
  status: 'pending' | 'graded' | 'rejected';
}

export interface AttendanceRecord {
  id: string;
  userId: string;
  courseId: string;
  sessionId: string;
  status: 'present' | 'absent' | 'late';
  timestamp: string;
}

export type QuestionType = 'mcq' | 'truefalse' | 'essay' | 'drag_drop' | 'file_upload';

export interface ExamQuestion {
  id: string;
  text: string;
  type: QuestionType;
  options?: string[];
  correctAnswer?: string; 
  points: number;
}

export interface Exam {
  id: string;
  courseId: string;
  title: string;
  passingScore: number;
  durationMinutes: number;
  attemptLimit: number;
  questions: ExamQuestion[];
  antiCheatEnabled: boolean;
  showResultsImmediately: boolean;
  isGenerated?: boolean;
}

export interface ExamAttempt {
  id: string;
  examId: string;
  userId: string;
  answers: { questionId: string, answer: string }[];
  score: number;
  status: 'passed' | 'failed' | 'pending_grading'; 
  startedAt: string;
  completedAt: string;
}

export type CourseLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert' | 'Diploma';
export type CourseCategory = 'AI' | 'Cybersecurity' | 'Web' | 'Mobile' | 'Design' | 'Data' | 'Business' | 'Programming' | 'Management' | 'Finance' | 'Marketing';

export interface LessonResource {
  title: string;
  type: 'pdf' | 'ppt' | 'doc' | 'zip';
  url: string;
  size: string;
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  videoUrl: string;
  durationSeconds: number;
  orderIndex: number;
  textContent?: string; 
  resources?: LessonResource[]; 
}

export interface Course {
  id: string;
  title: string;
  description?: string;
  hours: number;
  skillLevel: CourseLevel;
  thumbnail?: string;
  status?: 'active' | 'inactive' | 'completed' | 'locked' | 'pending_verification';
  createdAt?: string;
  provider: string;
  category: CourseCategory;
  departmentId?: string; 
  skills: string[];
  lessons: Lesson[];
  exam?: Exam;
  assignments?: Assignment[]; 
  liveSessions?: LiveSession[]; 
  rating?: number; 
  price?: number;
  resources?: LessonResource[];
  isAIGenerated?: boolean;
  publisherId?: string; 
  aiScore?: number; 
  dropOffRate?: number; 
  youtubePlaylistId?: string;
  lastSyncedAt?: string;
  reviews?: Review[];
}

export interface Book {
  id: string;
  title: string;
  author: string;
  category: CourseCategory;
  pages: number;
  summary?: string;
  coverUrl: string;
  pdfUrl?: string; 
  isDownloadable: boolean;
  rating: number;
  publishYear: string;
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  level: CourseLevel;
  category: CourseCategory;
  courses: string[]; 
  books: string[]; 
  estimatedHours: number;
  thumbnail: string;
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  year: string;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  duration: string;
  description?: string;
}

export interface Language {
  id: string;
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Native';
}

export interface CustomField {
  id: string;
  label: string;
  value: string;
}

export interface AcademicProject {
  id: string;
  title: string;
  description: string;
  specialization: string;
  level: 'Novice' | 'Intermediate' | 'Advanced' | 'Expert';
  attachments?: string[]; 
  status: 'pending' | 'approved' | 'reviewed';
  paymentStatus: 'paid' | 'unpaid' | 'pending_verification';
  fee: number;
  transactionId?: string;
  feedback?: string;
  createdAt: string;
  publisherId?: string; 
}

export type ServiceCategory = 'Design' | 'Programming' | 'Writing' | 'Marketing' | 'Video' | 'Consulting' | 'Other';

export interface ServiceListing {
  id: string;
  sellerId: string; 
  sellerName: string;
  sellerAvatar?: string;
  sellerVerified?: boolean; 
  title: string;
  description: string;
  price: number;
  category: ServiceCategory;
  deliveryTime: string; 
  rating: number;
  reviewCount: number;
  sales?: number; 
  thumbnail?: string;
  createdAt: string;
  status: 'active' | 'paused' | 'pending_payment';
}

export interface ProjectBid {
  id: string;
  freelancerName: string;
  freelancerAvatar: string;
  price: number;
  duration: string;
  proposal: string;
  rating: number;
  toolsUsed: string[]; 
}

export interface ProjectListing {
  id: string;
  clientId: string;
  title: string;
  description: string;
  budgetRange: string; 
  skills: string[];
  bids: ProjectBid[];
  status: 'Open' | 'In Progress' | 'Completed' | 'Review' | 'Pending Payment';
  createdAt: string;
  activeTools: string[]; 
}

export interface PublishedContent {
  id: string;
  type: 'Course' | 'Project' | 'Service';
  title: string;
  status: 'Active' | 'Pending' | 'Rejected';
  createdAt: string;
  price: number;
  views?: number;
}

export type ProductCondition = 'New' | 'Used - Like New' | 'Used - Good' | 'Used - Fair';
export type AuctionType = 'Fixed' | 'Auction';
export type ProductCategory = 'Cars' | 'Electronics' | 'Furniture' | 'Devices' | 'Services' | 'Animals' | 'Other';

export interface Review {
  id: string;
  reviewerName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface ProductListing {
  id: string;
  sellerId: string;
  sellerName: string;
  sellerAvatar?: string;
  sellerVerified?: boolean;
  sellerRating?: number;
  sellerJoinDate?: string;
  title: string;
  description: string;
  category: ProductCategory;
  condition: ProductCondition;
  location: string; 
  images: string[];
  tags?: string[]; 
  type: AuctionType;
  price: number; 
  isNegotiable?: boolean; 
  currentBid?: number;
  bidCount?: number;
  endsAt?: string; 
  views?: number; 
  contactClicks?: number; 
  status: 'active' | 'sold' | 'expired' | 'pending_payment' | 'shadow_banned'; 
  isSuspicious?: boolean; 
  createdAt: string;
}

export interface Transaction {
  id: string;
  serviceId?: string;
  productId?: string; 
  serviceTitle: string;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  sellerName: string;
  amount: number;
  fee?: number; 
  total?: number; 
  status: TransactionStatus;
  paymentMethod?: 'card' | 'paypal' | 'bank' | 'apple_pay' | 'mada';
  receiptUrl?: string; 
  receiptHash?: string; 
  createdAt: string;
  updatedAt: string;
}

export interface UserJob {
  id: string;
  title: string;
  company: string;
  description: string;
  location: string;
  type: string; 
  createdAt: string;
  status: 'active' | 'review' | 'pending_payment';
  logoUrl?: string;
  applicants?: Applicant[]; 
}

export interface Certificate {
  id: string;
  userId: string;
  courseId?: string; 
  resourceTitle?: string; 
  trainingNumber: string; 
  finalScore: number;
  grade: string;
  hours: number;
  certificateUrl?: string;
  qrCodeValue?: string;
  issuedAt: string;
  courseName: string;
  provider: string;
  verifyCode: string; 
  skills?: string[];
  signatureUrl?: string; 
  stampUrl?: string; 
  type: 'Course' | 'Path' | 'Workshop';
}

export interface CVRequest {
  id: string;
  userId: string;
  fullName: string;
  jobTitle: string;
  templateId: string;
  status: 'pending' | 'processing' | 'completed' | 'payment_review';
  paymentReceipt?: string;
  pdfUrl?: string;
  createdAt: string;
}

export interface EnrolledCourse {
  courseId: string;
  progress: number; 
  status: 'active' | 'completed' | 'locked';
  lastAccessed: string;
  attendanceRate?: number;
}

export interface ReadBook {
  bookId: string;
  progressPage: number;
  totalPages: number;
  status: 'reading' | 'completed';
  lastRead: string;
}

export interface SecurityLog {
  timestamp: string;
  ip: string;
  event: 'login_success' | 'login_failed' | 'password_change' | 'account_locked' | 'verification_success';
  details?: string;
}

export interface UserInteraction {
  id: string;
  type: 'comment' | 'review' | 'post' | 'like';
  target: string; 
  content?: string;
  date: string;
}

export interface Achievement {
  id: string;
  title: string;
  icon: string; 
  date: string;
  description: string;
}

export interface Badge {
  id: string;
  label: string;
  icon: string; 
  color: string;
  awardedAt: string;
}

export interface AdminConfig {
  ceoSignature?: string; 
  academicStamp?: string; 
  allowPrinting: boolean;
}

export interface AIAnalysisResult {
  overview: string;
  personalityArchetype: string;
  skillsRadar: {
    technical: number;
    leadership: number;
    communication: number;
    innovation: number;
    adaptability: number;
  };
  globalMarketMatch: number;
  topMatchedRoles: string[];
  salaryProjection: {
    current: string;
    potential: string;
  };
  criticalGaps: string[];
  recommendedActions: string[];
  analysisDate: string;
  analyzedBy: string; 
}

export interface KYCData {
  provider: 'Stripe Identity' | 'Onfido' | 'Veriff' | 'Nafath' | 'ID.me';
  status: 'verified' | 'pending' | 'failed' | 'none';
  verifiedAt: string;
  ageVerified: boolean;
  documentType?: string;
  facialMatchScore?: number;
  transactionId?: string;
}

export interface User {
  id: string;
  name: string;
  username?: string; // NEW: Username handle (e.g. @murad)
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
  linkedProviders: LoginProvider[]; 
  createdAt: string;
  lastLogin: string;
  authToken?: string;
  joinDate?: string; 
  
  citizenshipId?: string; 
  karma?: number; 
  titanDNA?: TitanDNA;
  crmData?: CRMUserExtension;
  wallet?: Wallet;
  primeSubscription?: PrimeSubscription;
  businessProfile?: BusinessProfile;
  followers?: string[]; 
  following?: string[]; 
  followersCount?: number; // Override for high numbers (e.g. 450M)
  followingCount?: number; // Override for high numbers
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
  isPhoneVerified?: boolean;
  isEmailVerified?: boolean;
  isIdentityVerified?: boolean; 
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
  aiAnalysis?: AIAnalysisResult;

  walletBalance?: number;
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