"use client";
import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged, signOut, User } from "firebase/auth";
import firebaseApp from "../lib/firebaseClient";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth(firebaseApp);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const logout = async () => {
    setLoading(true);
    const auth = getAuth(firebaseApp);
    try {
      // 1. Clear the cookie on the server
      await fetch("/api/logout", { method: "POST" });
      // 2. Sign out of Firebase on the client
      await signOut(auth);
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      setLoading(false);
    }
  };

  return { user, loading, logout };
};
