import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from 'firebase/app';
import { getReactNativePersistence, initializeAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// إعدادات Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDy_NAW5EnKqsAXnqmbnBFU0YUf2JB-8Ts",
  authDomain: "kickzone-bff5c.firebaseapp.com",
  projectId: "kickzone-bff5c",
  storageBucket: "kickzone-bff5c.firebasestorage.app",
  messagingSenderId: "138276992182",
  appId: "1:138276992182:web:d75a8710abb6c5c95b6217",
  measurementId: "G-HK0PNV62SY"
};

// تهيئة التطبيق
const app = initializeApp(firebaseConfig);

// تهيئة Auth مع تخزين الجلسة
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

// Firestore
const db = getFirestore(app);

export { app, auth, db, firebaseConfig };
