import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// My Real Configuration
const firebaseConfig = {
  apiKey: "AIzaSyCaZrwbnfC56mijdv1y8cuXmE4EXx0gwxk",
  authDomain: "murad-social.firebaseapp.com",
  projectId: "murad-social",
  storageBucket: "murad-social.firebasestorage.app",
  messagingSenderId: "234885746134",
  appId: "1:234885746134:web:c301bdee11fdc7252b6877",
  measurementId: "G-JTRHGCY9YZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services to be used across the app
export const db = getFirestore(app); // Database
export const auth = getAuth(app);    // Authentication
export const analytics = getAnalytics(app);

export { app };
