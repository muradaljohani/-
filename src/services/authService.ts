
import { auth, db, googleProvider, signInWithPopup, signOut } from '../lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

const ADMIN_EMAIL = "mrada4231@gmail.com"; // The ONLY Super Admin

/**
 * Signs in the user with Google and enforces Admin privileges for specific email.
 */
export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    const userRef = doc(db, 'users', user.uid);

    // --- STRICT ADMIN CHECK ---
    if (user.email === ADMIN_EMAIL) {
      console.log("⚡ Super Admin Recognized: Murad Aljohani");
      
      // Force Admin Identity & Privileges
      await setDoc(userRef, {
        id: user.uid,
        uid: user.uid, // Redundancy for queries
        name: "Murad Aljohani",
        email: user.email,
        username: "IpMurad", // Used for handle generation
        handle: "@IpMurad",  // Explicit handle
        avatar: user.photoURL,
        
        // GOD MODE FLAGS
        isAdmin: true,
        role: 'admin',
        isVerified: true,         // Standard verification
        isIdentityVerified: true, // Deep verification
        isGold: true,            // Gold/VIP status
        
        bio: "Founder & CEO of Milaf | مؤسس مجتمع ميلاف 🦅",
        
        lastLogin: serverTimestamp(),
        // Only set createdAt if it doesn't exist, but merge handles updates
        createdAt: serverTimestamp() 
      }, { merge: true });

    } else {
      // --- NORMAL USER LOGIC ---
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        // Create new regular user
        await setDoc(userRef, {
          id: user.uid,
          uid: user.uid,
          name: user.displayName,
          email: user.email,
          avatar: user.photoURL,
          createdAt: serverTimestamp(),
          followers: [],
          following: [],
          isVerified: false,
          isAdmin: false,
          role: 'student',
          bio: '',
          username: user.email?.split('@')[0] || user.uid.slice(0, 8),
          lastLogin: serverTimestamp()
        });
      } else {
        // Update last login for existing users
        await setDoc(userRef, { lastLogin: serverTimestamp() }, { merge: true });
      }
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
