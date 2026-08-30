import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyAD4AlkUZNyHqJYK6tDmrxBdnn70eRWP6g',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'saywise-ded12.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'saywise-ded12',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'saywise-ded12.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '492147069667',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:492147069667:web:c25265e919305c8c122bd6',
};

// Initialize Firebase safely
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export const firebaseAuthService = {
  async register(email: string, password: string, displayName: string) {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName) {
      await updateProfile(cred.user, { displayName });
    }
    const token = await cred.user.getIdToken();
    return {
      token,
      user: {
        id: cred.user.uid,
        email: cred.user.email || email,
        displayName: displayName || cred.user.displayName || email.split('@')[0],
        photoURL: cred.user.photoURL || undefined,
        authProvider: 'password' as const,
        createdAt: new Date().toISOString(),
      },
    };
  },

  async login(email: string, password: string) {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const token = await cred.user.getIdToken();
    return {
      token,
      user: {
        id: cred.user.uid,
        email: cred.user.email || email,
        displayName: cred.user.displayName || email.split('@')[0],
        photoURL: cred.user.photoURL || undefined,
        authProvider: 'password' as const,
        createdAt: new Date().toISOString(),
      },
    };
  },

  async loginWithGoogle() {
    const cred = await signInWithPopup(auth, googleProvider);
    const token = await cred.user.getIdToken();
    return {
      token,
      user: {
        id: cred.user.uid,
        email: cred.user.email || '',
        displayName: cred.user.displayName || 'Google User',
        photoURL: cred.user.photoURL || undefined,
        authProvider: 'google' as const,
        createdAt: new Date().toISOString(),
      },
    };
  },

  async logout() {
    await signOut(auth);
  },
};
