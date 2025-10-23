'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { Gamepad2, Languages, LogIn, LogOut } from 'lucide-react';
import { Logo } from '@/components/core/logo';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { User } from 'firebase/auth';
import type { Language, TranslationKeys } from '@/lib/i18n/translations';
import type { NavAppItem, NavItem } from './menu-options';

interface DesktopNavbarProps {
  appItems: NavAppItem[];
  presentationLinks: NavItem[];
  user?: User | null;
  language: Language;
  setLanguage: (language: Language) => void;
  t: TranslationKeys;
}

export function DesktopNavbar({
  appItems,
  presentationLinks,
  user,
  language,
  setLanguage,
  t,
}: DesktopNavbarProps) {
  const [isVisible, setIsVisible] = useState(false);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isCursorInActiveAreaRef = useRef(false);
  const navRef = useRef<HTMLElement | null>(null);

  // Auto-hide after 2 seconds of inactivity when outside the activation zone
  useEffect(() => {
    const clearHideTimer = () => {
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
        hideTimerRef.current = null;
      }
    };

    const scheduleHide = () => {
      clearHideTimer();
      hideTimerRef.current = setTimeout(() => {
        if (!isCursorInActiveAreaRef.current) {
          setIsVisible(false);
        }
      }, 2000);
    };

    const handleMouseMove = (event: MouseEvent) => {
      const activationHeight = 100;
      const inActivationZone = event.clientY <= activationHeight;
      const navBounds = navRef.current?.getBoundingClientRect();
      const navContainsTarget = navRef.current?.contains(event.target as Node) ?? false;
      const inNavbarBounds = navBounds
        ? event.clientX >= navBounds.left &&
          event.clientX <= navBounds.right &&
          event.clientY >= navBounds.top &&
          event.clientY <= navBounds.bottom
        : false;

      const isInActiveArea = inActivationZone || inNavbarBounds || navContainsTarget;
      isCursorInActiveAreaRef.current = isInActiveArea;

      if (isInActiveArea) {
        setIsVisible(true);
        clearHideTimer();
      } else {
        scheduleHide();
      }
    };

    const handleMouseLeave = () => {
      isCursorInActiveAreaRef.current = false;
      scheduleHide();
    };

    scheduleHide();
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      clearHideTimer();
    };
  }, []);

  return (
    <nav
      ref={navRef}
      className={`fixed left-1/2 top-4 z-50 hidden transition-all duration-500 ease-in-out lg:block ${
        isVisible
          ? 'translate-x-[-50%] translate-y-0 opacity-100'
          : 'pointer-events-none -translate-y-8 translate-x-[-50%] opacity-0'
      }`}
    >
      <div className="flex items-center justify-center rounded-2xl border border-slate-800/80 bg-slate-950/95 px-6 py-3 text-white shadow-[0_25px_80px_-40px_rgba(124,58,237,0.65)] backdrop-blur-md">
        {/* Left: Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <Logo className="mr-6" />
          </Link>
        </div>

        {/* Center: Navigation */}
        <div className="flex items-center px-4">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent text-white hover:text-white/80">
                  {t.nav.apps}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-2 p-4 md:w-[620px] md:auto-rows-[minmax(0,1fr)] md:grid-cols-[minmax(220px,1fr)_repeat(2,minmax(0,1fr))] lg:w-[820px]">
                    <li className="md:row-span-3">
                      <NavigationMenuLink asChild>
                        <div className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md">
                          <Gamepad2 className="mb-2 h-8 w-8 text-science" />
                          <div className="mb-2 mt-4 text-lg font-medium">{t.nav.games}</div>
                          <p className="text-sm leading-tight text-muted-foreground">
                            {t.nav.gamesDescription}
                          </p>
                        </div>
                      </NavigationMenuLink>
                    </li>
                    {appItems.map(item => (
                      <li key={item.key}>
                        <NavigationMenuLink asChild>
                          <Link
                            href={item.href}
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none">{item.title}</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              {item.description}
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent text-white hover:text-white/80">
                  {t.nav.presentation}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-[300px] gap-3 p-4">
                    {presentationLinks.map(item => (
                      <NavigationMenuLink asChild key={item.key}>
                        <Link
                          href={item.href}
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">{item.title}</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            {item.description}
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    ))}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              {/* Admin link only for authenticated users */}
              {user && (
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      href="/admin"
                      className="inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10 hover:text-white/80 focus:bg-white/10 focus:outline-none"
                    >
                      {t.nav.admin}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              )}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Right: Language + Auth */}
        <div className="ml-6 flex items-center space-x-3">
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="h-8 w-[110px] border-white/20 bg-white/10 text-white hover:bg-white/20">
              <Languages className="mr-1 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">{t.languages.en}</SelectItem>
              <SelectItem value="nl">{t.languages.nl}</SelectItem>
            </SelectContent>
          </Select>

          {user ? (
            <Button
              asChild
              className="bg-red-500 text-white transition-colors hover:bg-red-600"
              size="sm"
            >
              <Link href="/logout" className="flex items-center space-x-2">
                <LogOut className="h-4 w-4" />
                <span>{t.nav.logout}</span>
              </Link>
            </Button>
          ) : (
            <Button
              asChild
              variant="outline"
              className="border-white/30 bg-white/10 text-white transition-colors hover:bg-white/20"
              size="sm"
            >
              <Link href="/login" className="flex items-center space-x-2">
                <LogIn className="h-4 w-4" />
                <span>{t.nav.login}</span>
              </Link>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
