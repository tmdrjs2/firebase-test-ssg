// firebase.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"; // Import the Firebase Authentication module
import { getFirestore } from "firebase/firestore"; // ⭐️ 1. Firestore import

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBKYRH88R5dLNA_V-_qLFnRJvx5W4iAOSA",
  authDomain: "choi-c68e8.firebaseapp.com",
  projectId: "choi-c68e8",
  storageBucket: "choi-c68e8.firebasestorage.app",
  messagingSenderId: "271653456955",
  appId: "1:271653456955:web:6650fa77dc0a3dd061601e",
  measurementId: "G-RPXZQYDZ9F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Authentication
const auth = getAuth(app);

// ⭐️ 2. Initialize Firestore
const db = getFirestore(app);

// ⭐️ 3. auth와 db를 함께 export
export { auth, db };