
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyDkAViXwkndEhVEa-rkWnYWhQDDF2yXzxE",
    authDomain: "live-mandate.firebaseapp.com",
    projectId: "live-mandate",
    storageBucket: "live-mandate.firebasestorage.app",
    messagingSenderId: "1036927682756",
    appId: "1:1036927682756:web:052979d9ecfa36ea9c6191",
    measurementId: "G-7V3MS60MP2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export default app;
