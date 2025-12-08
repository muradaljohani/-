
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics, isSupported } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCvk5AEXCPHhUn0PlK5ipXd-7UYW9jBVjw",
  authDomain: "murad-portal.firebaseapp.com",
  projectId: "murad-portal",
  storageBucket: "murad-portal.firebasestorage.app",
  messagingSenderId: "12324821516",
  appId: "1:12324821516:web:6fd6cf9a96055711572c29",
  measurementId: "G-PT4XEVF6ZQ"
};

let app;
let auth;
let googleProvider;
let analytics;

try {
  // Check if config is valid (prevent crash if keys are placeholders)
  if (firebaseConfig.apiKey && firebaseConfig.apiKey !== "YOUR_API_KEY") {
      // Initialize Firebase (Singleton pattern)
      app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
      
      // Initialize Auth
      auth = getAuth(app);
      googleProvider = new GoogleAuthProvider();
      
      // Initialize Analytics (Async check)
      isSupported().then(yes => {
        if (yes) analytics = getAnalytics(app);
      }).catch(() => console.warn("Analytics not supported in this environment"));
      
  } else {
      console.warn("Firebase Config: Missing API Key. Auth disabled.");
  }
} catch (error) {
  console.error("Firebase Initialization Failed:", error);
}

export { app, auth, googleProvider, analytics };
