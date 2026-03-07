'use client';

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAnalytics, Analytics, isSupported } from 'firebase/analytics';
import { firebaseConfig } from './config';

/**
 * Validates if the firebase config is real or just placeholders.
 */
const isConfigValid = () => {
  return (
    firebaseConfig.apiKey && 
    firebaseConfig.apiKey !== "AIzaSy..." && 
    !firebaseConfig.apiKey.includes("your-")
  );
};

/**
 * Initializes the Firebase App and Analytics.
 */
export function initializeFirebase() {
  // If config is placeholder, return nulls to avoid console errors
  if (!isConfigValid()) {
    return { app: null, analytics: null };
  }

  const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  
  let analytics: Analytics | undefined;
  
  // Analytics only runs on the client and if supported by the browser
  if (typeof window !== 'undefined') {
    isSupported().then((supported) => {
      if (supported && isConfigValid()) {
        analytics = getAnalytics(app);
      }
    });
  }

  return { app, analytics };
}
