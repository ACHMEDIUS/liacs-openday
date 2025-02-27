"use client";

import Link from "next/link";
import { useAuth } from "../../hooks/useAuth";
import Image from "next/image";

export default function Navbar() {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  return (
    <nav className="grid grid-cols-3 items-center p-4  text-white shadow-md bg-leiden">
      {/* Left: Logo linking to home */}
      <section>
        <Link href="/">
          <Image
            src="/UniLeidenLogo.png"
            alt="Leiden University Logo"
            width={100}
            height={50}
            priority
          />
        </Link>
      </section>

      {/* Center: Navigation Links */}
      <section className="flex justify-center space-x-8">
        {user && (
          <>
            <Link href="/wheel">Wheel</Link>
            <Link href="/interactive">Interactive</Link>
            <Link href="/qna">Q&A</Link>
            <Link href="/presentation">Presentation</Link>
            <Link href="/questions">Questions</Link>
          </>
        )}
      </section>

      {/* Right: Login/Logout */}
      <section className="flex justify-end text-white">
        {user ? (
          <Link href="/logout" className="hover:underline">
            Logout
          </Link>
        ) : (
          <Link href="/login" className="hover:underline">
            Login
          </Link>
        )}
      </section>
    </nav>
  );
}
