// lib/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your Firebase config from Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyDjjqPvP4Oj6_MmwZzS6LBRS8UlwGhevbg",
  authDomain: "bikelock-8391e.firebaseapp.com",
  databaseURL: "https://bikelock-8391e-default-rtdb.firebaseio.com",
  projectId: "bikelock-8391e",
  storageBucket: "bikelock-8391e.firebasestorage.app",
  messagingSenderId: "822217788690",
  appId: "1:822217788690:web:42f5349df8a9cb365cb7cb"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
