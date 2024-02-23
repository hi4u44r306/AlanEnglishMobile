import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "@firebase/firestore";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAEDlCj0bsRoiacVPhFHff_eb0RfqeB8uA",
  authDomain: "alan-english-listening.firebaseapp.com",
  databaseURL: "https://alan-english-listening-default-rtdb.firebaseio.com",
  projectId: "alan-english-listening",
  storageBucket: "alan-english-listening.appspot.com",
  messagingSenderId: "1045346213843",
  appId: "1:1045346213843:web:b2a25425a24e9bc9331926",
  measurementId: "G-7MW8Y5XPH0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const authentication = getAuth(app);
export const db = getFirestore(app);
export const rtdb = getDatabase(app);