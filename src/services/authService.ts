
import { auth, db, googleProvider, githubProvider, signInWithPopup, signOut } from '../lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
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
  User
} from 'firebase/auth';

const ADMIN_EMAIL = "mrada4231@gmail.com";

// ... (Existing login functions remain the same) ...
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
 * Link a new auth provider to the CURRENTLY logged-in user.
 * REAL IMPLEMENTATION: Updates Firestore Flags.
 */
export const linkProvider = async (providerId: string): Promise<User> => {
  if (!auth.currentUser) {
    throw new Error("يجب تسجيل الدخول أولاً للقيام بعملية الربط.");
  }

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
    // 1. Perform Real Firebase Linking
    const result = await linkWithPopup(auth.currentUser, provider);
    const user = result.user;

    // 2. Update Firestore with Specific Flags for Badges
    const userRef = doc(db, 'users', user.uid);
    const updates: any = { isVerified: true }; // General verified flag
    
    if (providerId === 'github.com') updates.isGithubVerified = true;
    if (providerId === 'yahoo.com') updates.isYahooVerified = true;
    if (providerId === 'google.com') updates.isGoogleVerified = true;
    if (providerId === 'microsoft.com') updates.isMicrosoftVerified = true;
    
    // Explicitly update Firestore so the profile page sees it
    await updateDoc(userRef, updates);

    return user;
  } catch (error: any) {
    console.error("Link Account Error:", error);
    if (error.code === 'auth/credential-already-in-use') {
      throw new Error("هذا الحساب مرتبط بالفعل بمستخدم آخر. لا يمكن ربطه بالحساب الحالي.");
    }
    throw error;
  }
};

/**
 * Unlink an auth provider from the account
 */
export const unlinkProvider = async (providerId: string): Promise<User> => {
  if (!auth.currentUser) {
      throw new Error("No active session.");
  }
  
  try {
    const result = await unlink(auth.currentUser, providerId);
    
    // Update Firestore to remove verification flags
    const userRef = doc(db, 'users', result.uid);
    const updates: any = {};
    
    if (providerId === 'github.com') updates.isGithubVerified = false;
    if (providerId === 'yahoo.com') updates.isYahooVerified = false;
    if (providerId === 'google.com') updates.isGoogleVerified = false;
    if (providerId === 'microsoft.com') updates.isMicrosoftVerified = false;

    if (Object.keys(updates).length > 0) {
        await updateDoc(userRef, updates);
    }

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
