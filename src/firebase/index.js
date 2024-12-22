// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

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

// Firebase Initialisatie
const app = initializeApp(firebaseConfig);

// Initialiseer Firestore en Auth
const db  = getFirestore(app);
const auth = getAuth(app);


export { db, auth  };
