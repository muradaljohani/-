
import { 
  auth, 
  db, 
  googleProvider, 
  githubProvider, 
  signInWithPopup, 
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
  sendPasswordResetEmail
} from '../lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp, updateDoc, deleteDoc } from 'firebase/firestore';
import { 
  RecaptchaVerifier, 
  signInWithPhoneNumber, 
  linkWithPhoneNumber,
  ConfirmationResult, 
  OAuthProvider, 
  linkWithPopup, 
  unlink, 
  GoogleAuthProvider, 
  GithubAuthProvider, 
  FacebookAuthProvider,
  User,
  deleteUser
} from 'firebase/auth';

const ADMIN_EMAIL = "mrada4231@gmail.com";

// --- EMAIL & PASSWORD AUTH ---

export const registerWithEmail = async (email: string, pass: string, fullName: string, phone: string, nationalId: string) => {
    try {
        // 1. Create Auth User
        const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
        const user = userCredential.user;

        // 2. Update Display Name
        await updateProfile(user, { displayName: fullName });

        // 3. Send Verification Email
        await sendEmailVerification(user);

        // 4. Create Firestore Document
        await setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            name: fullName,
            email: email,
            phone: phone,
            nationalId: nationalId,
            role: 'student',
            avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${fullName}`,
            createdAt: serverTimestamp(),
            lastLogin: serverTimestamp(),
            isVerified: false, // Email not verified yet
            isIdentityVerified: false,
            followers: [],
            following: []
        });

        return { success: true, user };
    } catch (error: any) {
        console.error("Registration Error:", error);
        throw error;
    }
};

export const loginWithEmail = async (email: string, pass: string) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, pass);
        const user = userCredential.user;

        // Sync Last Login
        const userRef = doc(db, 'users', user.uid);
        await setDoc(userRef, { lastLogin: serverTimestamp() }, { merge: true });

        // Check Admin
        if (user.email === ADMIN_EMAIL) {
             await setDoc(userRef, { 
                 role: 'admin', 
                 isAdmin: true,
                 isGold: true 
             }, { merge: true });
        }

        return { success: true, user };
    } catch (error: any) {
        console.error("Login Error:", error);
        throw error;
    }
};

export const resetPassword = async (email: string) => {
    try {
        await sendPasswordResetEmail(auth, email);
        return { success: true };
    } catch (error: any) {
        console.error("Reset Password Error:", error);
        throw error;
    }
};

// --- EXISTING SOCIAL AUTH ---

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
      
      await setDoc(userRef, {
        id: user.uid,
        uid: user.uid,
        name: "Murad Aljohani",
        email: user.email,
        username: "IpMurad",
        handle: "@IpMurad",
        avatar: user.photoURL,
        isAdmin: true,
        role: 'admin',
        isVerified: true,
        isIdentityVerified: true,
        isGold: true,
        bio: "Founder & CEO of Milaf | مؤسس مجتمع ميلاف 🦅",
        lastLogin: serverTimestamp(),
        createdAt: serverTimestamp() 
      }, { merge: true });

    } else {
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) {
        await setDoc(userRef, {
          id: user.uid,
          uid: user.uid,
          name: user.displayName,
          email: user.email,
          avatar: user.photoURL,
          createdAt: serverTimestamp(),
          followers: [],
          following: [],
          isVerified: true,
          isAdmin: false,
          role: 'student',
          bio: '',
          username: user.email?.split('@')[0] || user.uid.slice(0, 8),
          lastLogin: serverTimestamp()
        });
      } else {
        await setDoc(userRef, { lastLogin: serverTimestamp() }, { merge: true });
      }
    }
    
    return user;
  } catch (error) {
    console.error("Google Sign-In Error:", error);
    throw error;
  }
};

export const loginWithGithub = async () => {
  githubProvider.addScope('read:user');
  try {
    const result = await signInWithPopup(auth, githubProvider);
    return result.user;
  } catch (error: any) {
    console.error("GitHub Login Error:", error);
    throw error;
  }
};

export const loginWithYahoo = async () => {
  const provider = new OAuthProvider('yahoo.com');
  provider.addScope('email');
  provider.addScope('profile');
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error: any) {
    console.error("Yahoo Login Error:", error);
    throw error;
  }
};

/**
 * Link a new auth provider to the PASSED logged-in user.
 * Performs the handshake and returns the updated User object.
 */
export const linkProvider = async (user: User, providerId: string): Promise<User> => {
  let provider;
  switch (providerId) {
    case 'google.com': 
      provider = new GoogleAuthProvider(); 
      break;
    case 'github.com': 
      provider = new GithubAuthProvider(); 
      break;
    case 'microsoft.com': 
      provider = new OAuthProvider('microsoft.com'); 
      provider.setCustomParameters({ prompt: 'select_account' });
      break;
    case 'yahoo.com': 
      provider = new OAuthProvider('yahoo.com'); 
      provider.setCustomParameters({ prompt: 'login' });
      break;
    case 'facebook.com': 
      provider = new FacebookAuthProvider(); 
      break;
    default: 
      throw new Error(`Provider ${providerId} is not supported.`);
  }

  try {
    const result = await linkWithPopup(user, provider);
    return result.user;
  } catch (error: any) {
    console.error("Link Account Error:", error);
    if (error.code === 'auth/credential-already-in-use') {
      throw new Error("هذا الحساب مرتبط بالفعل بمستخدم آخر. لا يمكن ربطه بالحساب الحالي.");
    }
    throw error;
  }
};

export const unlinkProvider = async (user: User, providerId: string): Promise<User> => {
  try {
    const result = await unlink(user, providerId);
    return result;
  } catch (error: any) {
    console.error("Unlink Error:", error);
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Logout Error:", error);
    throw error;
  }
};

export const deleteUserAccount = async () => {
    const user = auth.currentUser;
    if (user) {
        try {
            // Delete Firestore doc first
            await deleteDoc(doc(db, "users", user.uid));
            // Then delete Auth user
            await deleteUser(user);
        } catch (error) {
            console.error("Delete Account Error:", error);
            throw error;
        }
    } else {
        throw new Error("No user logged in");
    }
};

export const setupRecaptcha = (elementId: string): RecaptchaVerifier => {
  if ((window as any).recaptchaVerifier) {
    try {
      (window as any).recaptchaVerifier.clear();
    } catch (e) {
      console.warn("Recaptcha clear error (harmless):", e);
    }
    (window as any).recaptchaVerifier = null;
  }

  const verifier = new RecaptchaVerifier(auth, elementId, {
    'size': 'invisible',
    'callback': (response: any) => {
      console.log("Recaptcha Verified Successfully");
    },
    'expired-callback': () => {
      console.log("Recaptcha Expired");
    }
  });

  (window as any).recaptchaVerifier = verifier;
  return verifier;
};

export const verifyUserPhoneNumber = async (phoneNumber: string, recaptchaVerifier: RecaptchaVerifier): Promise<ConfirmationResult> => {
  try {
    if (auth.currentUser) {
      console.log("Linking phone to existing user session...");
      return await linkWithPhoneNumber(auth.currentUser, phoneNumber, recaptchaVerifier);
    } else {
      console.log("Starting new phone sign-in session...");
      return await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
    }
  } catch (error) {
    console.error("Phone Verification Error (Service Level):", error);
    throw error;
  }
};

export const confirmPhoneCode = async (confirmationResult: ConfirmationResult, code: string): Promise<any> => {
  try {
    const result = await confirmationResult.confirm(code);
    return result.user;
  } catch (error) {
    console.error("OTP Confirmation Error:", error);
    throw error;
  }
};
