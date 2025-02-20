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

  // Use the redirect path if provided, otherwise default to "/"
  const redirectPath = searchParams.get("redirect") || "/";

  const handleLogin = useCallback(async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(""); // Clear any existing error

    const auth = getAuth(firebaseApp);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // On success, redirect the user to the protected page or fallback
      router.replace(redirectPath);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    }
  }, [email, password, redirectPath, router]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded shadow-md w-full max-w-sm"
      >
        <h1 className="text-xl font-bold mb-4">Login</h1>
        {error && <p className="text-red-500 mb-2">{error}</p>}

        <div className="mb-4">
          <label htmlFor="email" className="block font-semibold mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="border p-2 w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block font-semibold mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            className="border p-2 w-full"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="********"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 w-full rounded hover:bg-blue-600"
        >
          Log In
        </button>
      </form>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginPageContent />
    </Suspense>
  );
}
