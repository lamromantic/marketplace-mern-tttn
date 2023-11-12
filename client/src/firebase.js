// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "marketplace-mern.firebaseapp.com",
  projectId: "marketplace-mern",
  storageBucket: "marketplace-mern.appspot.com",
  messagingSenderId: "939961285775",
  appId: "1:939961285775:web:29d001bbd0a0314e5d44fa"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);