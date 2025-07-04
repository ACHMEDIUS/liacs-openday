"use client";

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { useEffect } from "react";
import { firebaseConfig } from "@/lib/firebase";

export default function AnalyticsProvider() {
  useEffect(() => {
    const app = initializeApp(firebaseConfig);
    getAnalytics(app);
  }, []);

  return null;
}