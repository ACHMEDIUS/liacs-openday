"use client";
import { useAuth } from "@/hooks/useAuth";
import LoadingSpinner from "@/components/Loader/LoadingSpinner";

export default function ProtectedClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return <>{children}</>;
}
