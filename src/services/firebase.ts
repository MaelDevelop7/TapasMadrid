// src/services/firebase.ts
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth, signInAnonymously, onAuthStateChanged  } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Config Firebase
const firebaseConfig = {
  apiKey: "AIzaSyB34vwxqdgDvGctHQfEfrBJSk04a1rzQgg",
  authDomain: "tapasradar.firebaseapp.com",
  projectId: "tapasradar",
  storageBucket: "tapasradar.appspot.com", // <-- corrigé ici
  messagingSenderId: "164963298374",
  appId: "1:164963298374:web:5e29f30e084ede3ecdae47",
  measurementId: "G-0GS8PM4XGB"
};

// Init app
const app = initializeApp(firebaseConfig);

// Init Analytics si supporté
let analytics: ReturnType<typeof getAnalytics> | null = null;
isSupported().then((supported: any) => {
  if (supported) {
    analytics = getAnalytics(app);
  }
});


// Auth & Firestore
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db, analytics, signInAnonymously, onAuthStateChanged };
