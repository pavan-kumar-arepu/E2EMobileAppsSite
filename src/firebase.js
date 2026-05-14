// src/firebase.js
// Firebase Web SDK initialisation for VANI Pilot Portal
// Project: vanicorev0
//
// The three REACT_APP_FIREBASE_* values come from:
//   Firebase Console → Project Settings → Your apps → Web → SDK config
//
// For local dev: set them in .env.local (never commit that file)
// For Netlify:   set them in Netlify Dashboard → Site → Environment variables

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey:            process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain:        'vanicorev0.firebaseapp.com',
  projectId:         'vanicorev0',
  storageBucket:     'vanicorev0.appspot.com',
  messagingSenderId: process.env.REACT_APP_FIREBASE_SENDER_ID,
  appId:             process.env.REACT_APP_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db   = getFirestore(app);
