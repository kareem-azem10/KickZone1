import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDy_NAW5EnKqsAXnqmbnBFU0YUf2JB-8Ts",
  authDomain: "kickzone-bff5c.firebaseapp.com",
  projectId: "kickzone-bff5c",
  storageBucket: "kickzone-bff5c.firebasestorage.app",
  messagingSenderId: "138276992182",
  appId: "1:138276992182:web:d75a8710abb6c5c95b6217",
  measurementId: "G-HK0PNV62SY"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Export Firestore instance
export const db = getFirestore(app);
export { app, firebaseConfig };