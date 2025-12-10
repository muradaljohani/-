
import { auth, db, googleProvider, signInWithPopup, signOut } from '../lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

/**
 * Signs in the user with Google and ensures their user document exists in Firestore.
 */
export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      // Create new user document
      await setDoc(userRef, {
        id: user.uid,
        name: user.displayName,
        email: user.email,
        avatar: user.photoURL,
        createdAt: serverTimestamp(),
        followers: [],
        following: [],
        isVerified: false,
        bio: '',
        username: user.email?.split('@')[0] || user.uid.slice(0, 8),
        lastLogin: serverTimestamp()
      });
    } else {
        // Update last login
        await setDoc(userRef, { lastLogin: serverTimestamp() }, { merge: true });
    }
    
    return user;
  } catch (error) {
    console.error("Google Sign-In Error:", error);
    throw error;
  }
};

/**
 * Signs out the current user.
 */
export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Logout Error:", error);
    throw error;
  }
};
