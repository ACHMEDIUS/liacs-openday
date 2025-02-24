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
    <nav className="grid grid-cols-3 items-center p-4 bg-white text-black shadow-md">
      {/* Left: Logo linking to home */}
      <section>
        <Link href="/">
          <Image
            src="/UniversiteitLeidenLogo.svg"
            alt="Leiden University Logo"
            width={75}
            height={33} // aspect ratio ~799x353
            priority
          />
        </Link>
      </section>

      {/* Center: Navigation Links */}
      <section className="flex justify-center space-x-8">
        <Link href="/wheel">Wheel</Link>
        <Link href="/interactive">Interactive</Link>
        <Link href="/qna">Q&A</Link>
        <Link href="/presentation">Presentation</Link>
        <Link href="/questions">Questions</Link>
      </section>

      {/* Right: Login/Logout */}
      <section className="flex justify-end">
        {user ? (
          <Link href="/logout" className="text-black hover:underline">
            Logout
          </Link>
        ) : (
          <Link href="/login" className="text-black hover:underline">
            Login
          </Link>
        )}
      </section>
    </nav>
  );
}
