// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAHI306xe3GqY8kRv2buGeE2qG3IJ9ffw4",
  authDomain: "booklibrary-2e659.firebaseapp.com",
  projectId: "booklibrary-2e659",
  storageBucket: "booklibrary-2e659.firebasestorage.app",
  messagingSenderId: "100972426424",
  appId: "1:100972426424:web:bae7924107f14552e5304d",
  measurementId: "G-RHC1FWY860"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
const analytics = getAnalytics(app);