// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBij91IUIdaycuRFA4rW0r3Siqc2tcp1mY",
  authDomain: "prepwise-f48e6.firebaseapp.com",
  databaseURL: "https://prepwise-f48e6-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "prepwise-f48e6",
  storageBucket: "prepwise-f48e6.firebasestorage.app",
  messagingSenderId: "349158339484",
  appId: "1:349158339484:web:841e177e01f8b1a4814e59",
  measurementId: "G-81MF7TSYHR"
};

// Initialize Firebase
const app = !getApps.length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);