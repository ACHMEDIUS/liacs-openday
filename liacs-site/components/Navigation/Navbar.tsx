"use client";

import Link from "next/link";
import { useAuth } from "../../hooks/useAuth";
import Image from "next/image";
import MenuBarIcon from "../Icons/MenuBar";
import { useState } from "react";

export default function Navbar() {
  const { user, loading } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  if (loading) {
    return null;
  }

  return (
    <nav className="bg-leiden p-4 text-white shadow-md">
      <div className="flex justify-between items-center">
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

        {/* Center: Navigation Links - Hidden on mobile, visible on desktop */}
        <section className="hidden lg:flex justify-center space-x-8">
          {user && (
            <>
              <Link href="/wheel" className="hover:underline">Wheel</Link>
              <Link href="/interactive" className="hover:underline">Interactive</Link>
              <Link href="/qna" className="hover:underline">Q&A</Link>
              <Link href="/presentation" className="hover:underline">Presentation</Link>
              <Link href="/questions" className="hover:underline">Questions</Link>
            </>
          )}
        </section>

        {/* Right: Login/Logout + Mobile Menu Button */}
        <section className="flex items-center space-x-4">
          {/* Login/Logout - Always visible on desktop */}
          <div className="hidden lg:block">
            {user ? (
              <Link href="/logout" className="hover:underline">
                Logout
              </Link>
            ) : (
              <Link href="/login" className="hover:underline">
                Login
              </Link>
            )}
          </div>
          
          {/* Mobile Menu Button - Right aligned */}
          <button 
            className="lg:hidden text-white focus:outline-none"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <MenuBarIcon className="size-6" />
          </button>
        </section>
      </div>

      {/* Mobile Menu - Slides down when hamburger menu is clicked */}
      {isMenuOpen && (
        <div className="lg:hidden pt-4 pb-2 px-2 flex flex-col space-y-4 border-t border-white/20 mt-4 animate-fadeIn">
          {user ? (
            <>
              <Link href="/wheel" className="hover:underline block py-2" onClick={toggleMenu}>Wheel</Link>
              <Link href="/interactive" className="hover:underline block py-2" onClick={toggleMenu}>Interactive</Link>
              <Link href="/qna" className="hover:underline block py-2" onClick={toggleMenu}>Q&A</Link>
              <Link href="/presentation" className="hover:underline block py-2" onClick={toggleMenu}>Presentation</Link>
              <Link href="/questions" className="hover:underline block py-2" onClick={toggleMenu}>Questions</Link>
              <Link href="/logout" className="hover:underline block py-2" onClick={toggleMenu}>Logout</Link>
            </>
          ) : (
            <Link href="/login" className="hover:underline block py-2" onClick={toggleMenu}>Login</Link>
          )}
        </div>
      )}
    </nav>
  );
}