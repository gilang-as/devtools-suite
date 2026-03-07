'use client';

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAnalytics, Analytics, isSupported } from 'firebase/analytics';
import { firebaseConfig } from './config';

/**
 * Initializes the Firebase App and Analytics.
 */
export function initializeFirebase() {
  const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  
  let analytics: Analytics | undefined;
  
  // Analytics only runs on the client and if supported by the browser
  if (typeof window !== 'undefined') {
    isSupported().then((supported) => {
      if (supported) {
        analytics = getAnalytics(app);
      }
    });
  }

  return { app, analytics };
}
