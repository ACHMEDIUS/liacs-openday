"use client";

import React, { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import LoadingSpinner from "../../components/Loader/LoadingSpinner";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Once we've loaded auth state (loading === false):
    // if there's no user, redirect to login with ?redirect=pathname
    if (!loading && !user) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [loading, user, pathname, router]);

  // While we're checking the user's auth state, show a loader
  if (loading) {
    return <LoadingSpinner />;
  }

  // If we have a user, render the protected content
  return <>{children}</>;
}
