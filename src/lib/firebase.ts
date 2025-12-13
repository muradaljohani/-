

// Re-export real Firebase functions to bridge the app to the actual SDK
import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
    getAuth, 
    GoogleAuthProvider, 
    FacebookAuthProvider, 
    TwitterAuthProvider, 
    GithubAuthProvider, 
    signInWithPopup, 
    signOut, 
    onAuthStateChanged, 
    sendPasswordResetEmail, 
    RecaptchaVerifier, 
    signInWithPhoneNumber, 
    OAuthProvider,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendEmailVerification,
    updateProfile
} from 'firebase/auth';
import { getFirestore, doc, collection, setDoc, getDoc, addDoc, updateDoc, deleteDoc, getDocs, query, orderBy, serverTimestamp, onSnapshot, where, limit, increment, Timestamp, or, arrayUnion, arrayRemove } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';
import { db, auth, storage, analytics, app } from '../../firebaseConfig';

// Export Singleton Instances from the real config
export { app, auth, db, storage, analytics };

// Export Providers
export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();
export const twitterProvider = new TwitterAuthProvider();
export const githubProvider = new GithubAuthProvider();

// Export Functions
export {
    signInWithPopup,
    signOut,
    onAuthStateChanged,
    sendPasswordResetEmail,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendEmailVerification,
    updateProfile,
    doc,
    collection,
    setDoc,
    getDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    getDocs,
    query,
    orderBy,
    where,
    limit,
    increment,
    arrayUnion,
    arrayRemove,
    serverTimestamp,
    Timestamp,
    onSnapshot,
    or,
    ref,
    uploadBytes,
    getDownloadURL,
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
    OAuthProvider,
    RecaptchaVerifier,
    signInWithPhoneNumber
};
