"use client";

import { FormEvent, useState, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import firebaseApp from "../../lib/firebaseClient";

function LoginPageContent() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/";

  const handleLogin = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setError("");

      // Check for too many failed attempts
      const storedCount = localStorage.getItem("failedLoginAttempts");
      const failedAttempts = storedCount ? parseInt(storedCount, 10) : 0;
      if (failedAttempts >= 10) {
        setError(
          "Your account is locked due to too many failed login attempts."
        );
        return;
      }

      const auth = getAuth(firebaseApp);
      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        localStorage.setItem("failedLoginAttempts", "0");

        // Retrieve the Firebase ID token
        const token = await userCredential.user.getIdToken();

        // Send the token to the API route to set a secure HTTP-only cookie
        const res = await fetch("/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        if (!res.ok) {
          throw new Error("Failed to set auth token.");
        }

        router.replace(redirectPath);
      } catch (err: unknown) {
        const newFailedAttempts = failedAttempts + 1;
        localStorage.setItem(
          "failedLoginAttempts",
          newFailedAttempts.toString()
        );
        if (err instanceof Error) {
          setError(
            `Login failed (Attempt ${newFailedAttempts} of 10): ${err.message}`
          );
        } else {
          setError(
            `Login failed (Attempt ${newFailedAttempts} of 10): An unknown error occurred`
          );
        }
      }
    },
    [email, password, redirectPath, router]
  );

  return (
    <main className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded shadow-lg w-full max-w-sm"
      >
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <section className="mb-4">
          <input
            id="email"
            type="email"
            className="border p-2 w-full text-black placeholder-gray-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
        </section>
        <section className="mb-4">
          <input
            id="password"
            type="password"
            className="border p-2 w-full text-gray-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
        </section>
        <button
          type="submit"
          className="bg-leiden text-white py-2 px-4 w-full rounded hover:bg-blue-600"
        >
          Log In
        </button>
      </form>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<section>Loading...</section>}>
      <LoginPageContent />
    </Suspense>
  );
}
