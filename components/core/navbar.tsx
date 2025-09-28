'use client';

import Link from 'next/link';
import { LogIn, LogOut, Gamepad2, Languages, Menu } from 'lucide-react';
import { Logo } from '@/components/core/logo';
import { useState, useEffect, useRef } from 'react';
import { useI18n } from '@/lib/i18n';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';

interface NavbarProps {
  user?: User | null;
  loading?: boolean;
}

function SidebarNavigation({ user }: { user?: User | null }) {
  const { language, setLanguage, t } = useI18n();
  const { setOpenMobile } = useSidebar();

  const closeSidebar = () => {
    setOpenMobile(false);
  };

  return (
    <SidebarContent className="bg-science text-white">
      <div className="flex items-center justify-center border-b border-white/20 p-6">
        <Link href="/" onClick={closeSidebar}>
          <Logo />
        </Link>
      </div>

      <SidebarGroup>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="text-white hover:bg-white/10">
              <Link href="/" onClick={closeSidebar}>
                {t.nav.home}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="text-white hover:bg-white/10">
              <Link href="/presentation" onClick={closeSidebar}>
                {t.nav.presentation}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>

      <SidebarGroup>
        <div className="px-3 pb-3">
          <Button
            asChild
            className="w-full bg-white text-leiden shadow-md hover:bg-white/90"
          >
            <Link href="/object-detection" onClick={closeSidebar}>
              {t.nav.objectDetection}
            </Link>
          </Button>
        </div>
      </SidebarGroup>

      <SidebarGroup>
        <SidebarGroupLabel className="text-white/70">{t.nav.apps}</SidebarGroupLabel>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="text-white hover:bg-white/10">
              <Link href="/wheel" onClick={closeSidebar}>
                {t.nav.wheelOfFortune}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="text-white hover:bg-white/10">
              <Link href="/interactive" onClick={closeSidebar}>
                {t.nav.interactiveProgramming}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="text-white hover:bg-white/10">
              <Link href="/sorting" onClick={closeSidebar}>
                {t.nav.sortingAlgorithms}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="text-white hover:bg-white/10">
              <Link href="/mazes" onClick={closeSidebar}>
                {t.nav.mazes}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="text-white hover:bg-white/10">
              <Link href="/oracle" onClick={closeSidebar}>
                {t.nav.oracle}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="text-white hover:bg-white/10">
              <Link href="/patterns" onClick={closeSidebar}>
                {t.nav.interestingPatterns}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>

      <SidebarGroup>
        <SidebarGroupLabel className="text-white/70">{t.nav.presentation}</SidebarGroupLabel>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="text-white hover:bg-white/10">
              <Link href="/questions/view" onClick={closeSidebar}>
                {t.nav.viewQuestions}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="text-white hover:bg-white/10">
              <Link href="/questions/add" onClick={closeSidebar}>
                {t.nav.addQuestions}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>

      {user && (
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild className="text-white hover:bg-white/10">
                <Link href="/admin" onClick={closeSidebar}>
                  {t.nav.admin}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      )}

      <SidebarGroup>
        <SidebarGroupLabel className="text-white/70">{t.nav.language}</SidebarGroupLabel>
        <div className="px-3">
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-full border-white/30 bg-white/10 text-white">
              <Languages className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">{t.languages.en}</SelectItem>
              <SelectItem value="nl">{t.languages.nl}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </SidebarGroup>

      <SidebarGroup>
        <div className="px-3 pb-6">
          {user ? (
            <Button asChild className="w-full bg-red-500 text-white hover:bg-red-600">
              <Link
                href="/logout"
                className="flex items-center justify-center space-x-2"
                onClick={closeSidebar}
              >
                <LogOut className="h-4 w-4" />
                <span>{t.nav.logout}</span>
              </Link>
            </Button>
          ) : (
            <Button
              asChild
              variant="outline"
              className="w-full border-white/30 bg-white/10 text-white hover:bg-white/20"
            >
              <Link
                href="/login"
                className="flex items-center justify-center space-x-2"
                onClick={closeSidebar}
              >
                <LogIn className="h-4 w-4" />
                <span>{t.nav.login}</span>
              </Link>
            </Button>
          )}
        </div>
      </SidebarGroup>
    </SidebarContent>
  );
}


export default function Navbar({ user, loading }: NavbarProps) {
  const { language, setLanguage, t } = useI18n();
  const [isVisible, setIsVisible] = useState(true);
  const [isInTopZone, setIsInTopZone] = useState(false);
  const hideTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastActivityRef = useRef<number>(Date.now());

  // Auto-hide after 2 seconds of inactivity
  useEffect(() => {
    const resetHideTimer = () => {
      lastActivityRef.current = Date.now();

      // Clear existing timer
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
      }

      // Show navbar immediately when there's activity
      if (!isInTopZone) {
        setIsVisible(true);
      }

      // Set new timer to hide after 2 seconds
      hideTimerRef.current = setTimeout(() => {
        if (!isInTopZone) {
          setIsVisible(false);
        }
      }, 2000);
    };

    // Track mouse movement for activity
    const handleMouseMove = (e: MouseEvent) => {
      // Check if mouse is in top 10vh zone
      const viewportHeight = window.innerHeight;
      const topZoneHeight = viewportHeight * 0.2; // 20vh
      const inZone = e.clientY <= topZoneHeight;

      setIsInTopZone(inZone);

      if (inZone) {
        setIsVisible(true);
        if (hideTimerRef.current) {
          clearTimeout(hideTimerRef.current);
        }
      } else {
        resetHideTimer();
      }
    };

    // Initial setup
    resetHideTimer();

    // Add event listeners
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
      }
    };
  }, [isInTopZone]);

  if (loading) {
    return null;
  }

  return (
    <>
      {/* Desktop Dock Navbar */}
      <nav
        className={`fixed left-1/2 top-4 z-50 hidden transition-all duration-500 ease-in-out lg:block ${
          isVisible
            ? 'translate-x-[-50%] translate-y-0 opacity-100'
            : 'pointer-events-none -translate-y-8 translate-x-[-50%] opacity-0'
        }`}
      >
        <div className="flex items-center justify-center rounded-2xl border-2 border-leiden bg-science px-6 py-3 shadow-lg shadow-leiden/50 backdrop-blur-sm">
          {/* Left: Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Logo className="mr-6" />
            </Link>
          </div>

          {/* Center: Navigation - now available to everyone */}
          <div className="flex items-center px-4">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent text-white hover:text-white/80">
                    {t.nav.apps}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-2 p-4 md:w-[620px] lg:w-[780px] lg:grid-cols-[.8fr_1fr_1fr]">
                      <li className="row-span-4">
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
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            href="/wheel"
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none">
                              {t.nav.wheelOfFortune}
                            </div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              {t.nav.wheelDescription}
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            href="/interactive"
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none">
                              {t.nav.interactiveProgramming}
                            </div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              {t.nav.interactiveDescription}
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            href="/sorting"
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none">
                              {t.nav.sortingAlgorithms}
                            </div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              {t.nav.sortingDescription}
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            href="/mazes"
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none">{t.nav.mazes}</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              {t.nav.mazesDescription}
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            href="/oracle"
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none">{t.nav.oracle}</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              {t.nav.oracleDescription}
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            href="/patterns"
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none">{t.nav.interestingPatterns}</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              {t.nav.interestingPatternsDescription}
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            href="/fluid-simulation"
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none">Fluid Simulation</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Interactive fluid dynamics visualization
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            href="/procedural-generation"
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none">Grapple Game</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Physics-based grappling with procedural generation
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent text-white hover:text-white/80">
                    {t.nav.presentation}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid w-[300px] gap-3 p-4">
                      <NavigationMenuLink asChild>
                        <Link
                          href="/questions/view"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">
                            {t.nav.viewQuestions}
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            {t.nav.viewQuestionsDescription}
                          </p>
                        </Link>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <Link
                          href="/questions/add"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">
                            {t.nav.addQuestions}
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            {t.nav.addQuestionsDescription}
                          </p>
                        </Link>
                      </NavigationMenuLink>
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

          {/* Right: Quick CTA + Language + Auth */}
          <div className="ml-6 flex items-center space-x-3">
            <Button
              asChild
              className="hidden bg-white text-leiden shadow-md transition hover:bg-white/90 lg:inline-flex"
              size="sm"
            >
              <Link href="/object-detection" className="flex items-center space-x-2">
                <span>{t.nav.objectDetection}</span>
              </Link>
            </Button>

            {/* Language Selector */}
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="h-8 w-[110px] border-white/30 bg-white/10 text-white hover:bg-white/20">
                <Languages className="mr-1 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">{t.languages.en}</SelectItem>
                <SelectItem value="nl">{t.languages.nl}</SelectItem>
              </SelectContent>
            </Select>

            {/* Auth Buttons */}
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

      {/* Mobile Navigation - Fixed positioning to avoid layout conflicts */}
      <div className="lg:hidden">
        <div className="fixed inset-0 z-40">
          <SidebarProvider>
            <Sidebar side="right" className="bg-science">
              <SidebarNavigation user={user} />
            </Sidebar>
            <div className="fixed right-4 top-4 z-50">
              <SidebarTrigger className="h-10 w-10 bg-science text-white hover:bg-science/80">
                <Menu className="h-6 w-6" />
              </SidebarTrigger>
            </div>
          </SidebarProvider>
        </div>
      </div>
    </>
  );
}
