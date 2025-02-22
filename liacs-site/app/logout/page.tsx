"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../hooks/useAuth";
import Loader from "../../components/Loader/LoadingSpinner";

export default function LogoutPage() {
  const { logout } = useAuth();
  const router = useRouter();
  const [hasLoggedOut, setHasLoggedOut] = useState(false);

  useEffect(() => {
    if (!hasLoggedOut) {
      setHasLoggedOut(true);

      (async () => {
        await logout();
        router.replace("/");
      })();
    }
  }, [hasLoggedOut, logout, router]);

  return <Loader />;
}
