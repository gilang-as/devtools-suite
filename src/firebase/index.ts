'use client';

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAnalytics, Analytics, isSupported } from 'firebase/analytics';
import { firebaseConfig } from './config';

/**
 * Validates if the firebase config is present and not a placeholder.
 * Stricter check to prevent "400 INVALID_ARGUMENT" from backend calls.
 */
export const isConfigValid = () => {
  const key = firebaseConfig.apiKey;
  return (
    !!key && 
    key.length > 20 && 
    key.startsWith('AIza') && // Real Firebase API keys always start with AIza
    !key.includes('YOUR_') && 
    !key.includes('PLACEHOLDER') &&
    key !== 'undefined'
  );
};

/**
 * Initializes the Firebase App.
 */
export function getFirebaseApp(): FirebaseApp | null {
  if (!isConfigValid()) {
    return null;
  }
  return getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
}

/**
 * Initializes Firebase Analytics asynchronously.
 */
export async function getFirebaseAnalytics(app: FirebaseApp): Promise<Analytics | null> {
  if (typeof window === 'undefined') return null;
  
  try {
    const supported = await isSupported();
    // Only attempt to get analytics if config is genuinely valid
    if (supported && isConfigValid()) {
      return getAnalytics(app);
    }
  } catch (e) {
    console.error("Firebase Analytics failed to initialize:", e);
  }
  return null;
}
