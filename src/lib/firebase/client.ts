import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAIs6peoUR-rS6zKtosaUyvsbYqCxQ9cR4",
  authDomain: "miyona-web.firebaseapp.com",
  projectId: "miyona-web",
  storageBucket: "miyona-web.firebasestorage.app",
  messagingSenderId: "834143154631",
  appId: "1:834143154631:web:faad6f6cdc88c1caa629e2",
  measurementId: "G-BC3EHEV9DF"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, db, googleProvider, signInWithPopup, signOut };
