import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider, TwitterAuthProvider, GithubAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyCvk5AEXCPHhUn0PlK5ipXd-7UYW9jBVjw",
    authDomain: "murad-portal.firebaseapp.com",
    projectId: "murad-portal",
    storageBucket: "murad-portal.firebasestorage.app",
    messagingSenderId: "12324821516",
    appId: "1:12324821516:web:6fd6cf9a96055711572c29",
    measurementId: "G-PT4XEVF6ZQ"
};

// Singleton pattern to prevent multiple initializations
let app;
let auth;
let db;
let storage;

const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();
const twitterProvider = new TwitterAuthProvider();
const githubProvider = new GithubAuthProvider();

try {
  if (getApps().length > 0) {
    app = getApp();
  } else {
    app = initializeApp(firebaseConfig);
  }
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
} catch (error) {
  console.error("Firebase Initialization Error:", error);
}

export { app, auth, db, storage, googleProvider, facebookProvider, twitterProvider, githubProvider };