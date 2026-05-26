import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCaBXGhNoiV2e76kCp5x8hUunqjyjduwbE",
  authDomain: "houston-spots.firebaseapp.com",
  projectId: "houston-spots",
  storageBucket: "houston-spots.firebasestorage.app",
  messagingSenderId: "755184831800",
  appId: "1:755184831800:web:3a824c2a6d28d4440645cd",
  measurementId: "G-YMC18YQJCW"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
