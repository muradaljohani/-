
// Re-export real Firebase functions to bridge the app to the actual SDK
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, FacebookAuthProvider, TwitterAuthProvider, GithubAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, collection, setDoc, getDoc, addDoc, updateDoc, getDocs, query, orderBy, serverTimestamp, onSnapshot, where, limit, increment } from 'firebase/firestore';
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
    doc,
    collection,
    setDoc,
    getDoc,
    addDoc,
    updateDoc,
    getDocs,
    query,
    orderBy,
    where,
    limit,
    increment,
    serverTimestamp,
    onSnapshot,
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
    GithubAuthProvider
};
