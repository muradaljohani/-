
// Mocking Firebase SDK to prevent build errors when 'firebase' package is missing.
// In a real environment with 'npm install firebase', these would be real imports.

// Mock Implementations
const initializeApp = (config: any) => ({ name: '[DEFAULT]' });
const getApps = () => [];
const getApp = () => ({ name: '[DEFAULT]' });
const getAuth = (app?: any) => ({ currentUser: null });
const getFirestore = (app?: any) => ({});
const getStorage = (app?: any) => ({});
const getAnalytics = (app?: any) => ({});

// Auth Providers
class GoogleAuthProvider {}
class FacebookAuthProvider {}
class TwitterAuthProvider {}
class GithubAuthProvider {}

// Auth Functions
const signInWithPopup = async (auth: any, provider: any) => {
    console.log("Mock signInWithPopup called");
    throw new Error("Firebase not connected (Mock Mode)");
};
const signOut = async (auth: any) => {
    console.log("Mock signOut called");
};
const onAuthStateChanged = (auth: any, callback: any) => {
    // Immediately return null user to simulate signed out or allow manual sign in via context
    callback(null);
    return () => {}; // Unsubscribe
};

// Firestore Functions
const doc = (db: any, col: string, id: string, ...pathSegments: string[]) => ({ path: `${col}/${id}` });
const collection = (db: any, path: string) => ({ path });
const setDoc = async (ref: any, data: any, options?: any) => {};
const getDoc = async (ref: any) => ({ exists: () => false, data: () => ({}) });
const addDoc = async (ref: any, data: any) => ({ id: 'mock-doc-id' });
const updateDoc = async (ref: any, data: any) => {};
const getDocs = async (query: any) => ({ docs: [] });
const query = (ref: any, ...constraints: any[]) => ref;
const orderBy = (field: string, direction?: string) => ({ type: 'orderBy', field, direction });
const serverTimestamp = () => new Date().toISOString();

// Storage Functions
const ref = (storage: any, path: string) => ({ path });
const uploadBytes = async (ref: any, file: any) => ({ ref });
const getDownloadURL = async (ref: any) => "https://via.placeholder.com/300";

// Exports
export {
    initializeApp,
    getApps,
    getApp,
    getAuth,
    getFirestore,
    getStorage,
    getAnalytics,
    GoogleAuthProvider,
    FacebookAuthProvider,
    TwitterAuthProvider,
    GithubAuthProvider,
    signInWithPopup,
    signOut,
    onAuthStateChanged,
    doc,
    collection,
    setDoc,
    getDoc,
    addDoc,
    updateDoc,
    getDocs,
    query,
    orderBy,
    serverTimestamp,
    ref,
    uploadBytes,
    getDownloadURL
};

// Singleton Instances (Mock)
const app = initializeApp({});
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Provider Instances
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();
const twitterProvider = new TwitterAuthProvider();
const githubProvider = new GithubAuthProvider();

export { app, auth, db, storage, googleProvider, facebookProvider, twitterProvider, githubProvider };
