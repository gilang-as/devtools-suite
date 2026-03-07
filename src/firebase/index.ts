'use client';

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAnalytics, Analytics, isSupported } from 'firebase/analytics';
import { firebaseConfig } from './config';

/**
 * Validates if the firebase config is real or just placeholders.
 * This prevents the "400 INVALID_ARGUMENT" errors in the console.
 */
export const isConfigValid = () => {
  return (
    firebaseConfig.apiKey && 
    firebaseConfig.apiKey !== "AIzaSy..." && 
    !firebaseConfig.apiKey.includes("your-")
  );
};

/**
 * Initializes the Firebase App.
 */
export function getFirebaseApp(): FirebaseApp | null {
  if (!isConfigValid()) return null;
  return getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
}

/**
 * Initializes Firebase Analytics asynchronously.
 */
export async function getFirebaseAnalytics(app: FirebaseApp): Promise<Analytics | null> {
  if (typeof window === 'undefined') return null;
  
  const supported = await isSupported();
  if (supported && isConfigValid()) {
    return getAnalytics(app);
  }
  return null;
}
