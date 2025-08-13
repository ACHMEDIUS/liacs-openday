'use client';
import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, signOut, User } from 'firebase/auth';
import firebaseApp from '../lib/firebase';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth(firebaseApp);
    const unsubscribe = onAuthStateChanged(auth, user => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const logout = async () => {
    setLoading(true);
    const auth = getAuth(firebaseApp);
    try {
      // Call the logout API to clear the cookie
      await fetch('/api/logout', {
        method: 'POST',
      });

      // Sign out from Firebase
      await signOut(auth);
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      setLoading(false);
    }
  };

  return { user, loading, logout };
};
