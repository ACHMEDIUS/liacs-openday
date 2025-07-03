'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Menu } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { User } from 'firebase/auth';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';

interface NavbarProps {
  user?: User | null;
  loading?: boolean;
}

export default function Navbar({ user, loading }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  if (loading) {
    return null;
  }

  return (
    <nav className="bg-leiden p-4 text-white shadow-md">
      <div className="flex items-center justify-between">
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

        {/* Center: Navigation Menu - Hidden on mobile, visible on desktop */}
        <section className="hidden lg:flex">
          {user && (
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-white hover:text-white/80">
                    Apps
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid w-[400px] gap-3 p-4 md:grid-cols-2">
                      <NavigationMenuLink asChild>
                        <Link
                          href="/wheel"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">Wheel of Fortune</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Spin the wheel for interactive presentations
                          </p>
                        </Link>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <Link
                          href="/interactive"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">
                            Interactive Programming
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Debug code challenges and test your skills
                          </p>
                        </Link>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <Link
                          href="/sorting"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">Sorting Algorithms</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Visualize and explore sorting algorithms
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-white hover:text-white/80">
                    Presentation
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid w-[300px] gap-3 p-4">
                      <NavigationMenuLink asChild>
                        <Link
                          href="/questions/view"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">View Questions</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Browse submitted questions
                          </p>
                        </Link>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <Link
                          href="/questions/add"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">Add Questions</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Submit new questions for Q&A
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      href="/admin"
                      className="inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10 hover:text-white/80 focus:bg-white/10 focus:outline-none"
                    >
                      Admin
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          )}
        </section>

        {/* Right: Login/Logout + Mobile Menu Button */}
        <section className="flex items-center space-x-4">
          {/* Login/Logout - Always visible on desktop */}
          <div className="hidden lg:block">
            {user ? (
              <Button variant="ghost" asChild>
                <Link href="/logout">Logout</Link>
              </Button>
            ) : (
              <Button variant="ghost" asChild>
                <Link href="/login">Login</Link>
              </Button>
            )}
          </div>

          {/* Mobile Menu Button - Right aligned */}
          <Button
            variant="ghost"
            size="sm"
            className="text-white focus:outline-none lg:hidden"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </section>
      </div>

      {/* Mobile Menu - Slides down when hamburger menu is clicked */}
      {isMenuOpen && (
        <div className="mt-4 flex flex-col space-y-4 border-t border-white/20 px-2 pb-2 pt-4 duration-200 animate-in slide-in-from-top-2 lg:hidden">
          {user ? (
            <>
              <div className="py-2 text-sm font-semibold text-white/60">Apps</div>
              <Link href="/wheel" className="block py-2 pl-4 hover:underline" onClick={toggleMenu}>
                Wheel of Fortune
              </Link>
              <Link
                href="/interactive"
                className="block py-2 pl-4 hover:underline"
                onClick={toggleMenu}
              >
                Interactive Programming
              </Link>
              <Link
                href="/sorting"
                className="block py-2 pl-4 hover:underline"
                onClick={toggleMenu}
              >
                Sorting Algorithms
              </Link>
              <div className="py-2 text-sm font-semibold text-white/60">Presentation</div>
              <Link
                href="/questions/view"
                className="block py-2 pl-4 hover:underline"
                onClick={toggleMenu}
              >
                View Questions
              </Link>
              <Link
                href="/questions/add"
                className="block py-2 pl-4 hover:underline"
                onClick={toggleMenu}
              >
                Add Questions
              </Link>
              <Link href="/admin" className="block py-2 hover:underline" onClick={toggleMenu}>
                Admin
              </Link>
              <Link href="/logout" className="block py-2 hover:underline" onClick={toggleMenu}>
                Logout
              </Link>
            </>
          ) : (
            <Link href="/login" className="block py-2 hover:underline" onClick={toggleMenu}>
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
