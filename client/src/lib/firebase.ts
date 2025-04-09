import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  GoogleAuthProvider, 
  signInWithPopup,
  User as FirebaseUser
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.appspot.com`,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// Authentication functions
export const loginWithEmail = async (email: string, password: string) => {
  try {
    // Log authentication attempt (but not password)
    console.log(`Attempting to sign in with email: ${email}`);
    
    // Try to sign in
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("Email authentication successful");
    return userCredential.user;
  } catch (error: any) {
    // Log and rethrow the error
    console.error("Email authentication error:", error.code, error.message);
    throw error;
  }
};

export const registerWithEmail = async (email: string, password: string) => {
  try {
    // Log registration attempt (but not password)
    console.log(`Attempting to register with email: ${email}`);
    
    // Try to create user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log("Email registration successful");
    return userCredential.user;
  } catch (error: any) {
    // Log and rethrow the error
    console.error("Email registration error:", error.code, error.message);
    throw error;
  }
};

export const loginWithGoogle = async () => {
  try {
    console.log("Attempting Google sign-in");
    
    // Configure Google provider with additional scopes if needed
    googleProvider.setCustomParameters({
      prompt: 'select_account'
    });
    
    // Add any additional scopes you might need
    googleProvider.addScope('email');
    googleProvider.addScope('profile');
    
    // Try sign in with popup first
    try {
      console.log("Opening Google auth popup");
      const result = await signInWithPopup(auth, googleProvider);
      console.log("Google popup authentication successful");
      return result.user;
    } catch (popupError: any) {
      console.error("Popup sign-in error:", popupError.code, popupError.message);
      
      // Handle specific popup errors
      if (popupError.code === 'auth/popup-blocked') {
        console.warn("Auth popup was blocked by the browser");
        throw popupError;
      } else if (popupError.code === 'auth/popup-closed-by-user') {
        console.warn("Auth popup was closed by the user");
        throw popupError;
      } else if (popupError.code === 'auth/cancelled-popup-request') {
        console.warn("Auth popup request was cancelled");
        throw popupError;
      } else if (popupError.code === 'auth/invalid-credential') {
        console.error("Invalid credential in Google sign-in");
        throw popupError;
      } else if (popupError.code === 'auth/unauthorized-domain') {
        console.error("This domain is not authorized in Firebase console");
        throw popupError;
      } else {
        console.error("Unhandled popup error:", popupError);
        throw popupError;
      }
    }
  } catch (error) {
    console.error("Google login error:", error);
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    console.log("Attempting to sign out user");
    await signOut(auth);
    console.log("User signed out successfully");
  } catch (error: any) {
    console.error("Logout error:", error.code, error.message);
    throw error;
  }
};

export const getCurrentUser = (): FirebaseUser | null => {
  return auth.currentUser;
};

export { auth, db };
