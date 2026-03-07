'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { FirebaseApp } from 'firebase/app';
import { Analytics } from 'firebase/analytics';
import { getFirebaseApp, getFirebaseAnalytics } from './index';

interface FirebaseContextType {
  app: FirebaseApp | null;
  analytics: Analytics | null;
}

const FirebaseContext = createContext<FirebaseContextType>({
  app: null,
  analytics: null,
});

export function FirebaseProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<FirebaseContextType>({
    app: null,
    analytics: null,
  });

  useEffect(() => {
    const app = getFirebaseApp();
    if (app) {
      setState(prev => ({ ...prev, app }));
      
      // Initialize analytics after app is ready and on the client
      getFirebaseAnalytics(app).then(analytics => {
        if (analytics) {
          setState(prev => ({ ...prev, analytics }));
        }
      });
    }
  }, []);

  return (
    <FirebaseContext.Provider value={state}>
      {children}
    </FirebaseContext.Provider>
  );
}

export const useFirebase = () => useContext(FirebaseContext);
export const useFirebaseApp = () => useFirebase().app;
export const useAnalytics = () => useFirebase().analytics;
