'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Languages, LogIn, LogOut } from 'lucide-react';
import { Logo } from '@/components/core/logo';
import { Button } from '@/components/ui/button';
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

interface MobileMenuProps {
  appItems: NavAppItem[];
  presentationLinks: NavItem[];
  user?: User | null;
  language: Language;
  setLanguage: (language: Language) => void;
  t: TranslationKeys;
}

const HEADER_HEIGHT_REM = '3.5rem'; // matches py-3 (0.75rem * 2) + line height

export function MobileMenu({
  appItems,
  presentationLinks,
  user,
  language,
  setLanguage,
  t,
}: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const mobileAppItems = appItems.filter(item => item.includeInMobile);

  return (
    <div className="lg:hidden">
      <div className="sticky top-0 z-40">
        <div className="flex items-center justify-between border-b border-slate-800/80 bg-slate-950/95 px-4 py-3">
          <Link href="/" className="flex items-center" onClick={() => setIsOpen(false)}>
            <Logo className="h-8 w-auto" />
          </Link>
          <button
            type="button"
            aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isOpen}
            onClick={() => setIsOpen(prev => !prev)}
            className="relative flex h-10 w-10 items-center justify-center transition focus:outline-none focus:ring-2 focus:ring-purple-400/60"
          >
            <span
              className={`absolute h-0.5 w-6 rounded-full transition-all duration-300 ${
                isOpen ? 'translate-y-0 rotate-45 bg-red-500' : '-translate-y-1.5 bg-white'
              }`}
            />
            <span
              className={`absolute h-0.5 w-6 rounded-full transition-all duration-300 ${
                isOpen ? 'translate-y-0 -rotate-45 bg-red-500' : 'translate-y-1.5 bg-white'
              }`}
            />
          </button>
        </div>

        <div
          className={`overflow-hidden transition-[max-height] duration-300 ease-in-out ${
            isOpen ? 'max-h-screen' : 'max-h-0'
          }`}
        >
          <div
            className="bg-gradient-to-b from-slate-950 via-purple-950/95 to-slate-950 text-white"
            style={{ height: `calc(100vh - ${HEADER_HEIGHT_REM})` }}
          >
            <div className="flex h-full flex-col">
              <div className="flex-1 overflow-y-auto px-6 pb-8 pt-8">
                <div className="mb-8 flex flex-col gap-4">
                  <div className="flex flex-wrap gap-3">
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger className="h-10 min-w-[140px] flex-1 border-white/20 bg-white/10 text-white hover:bg-white/20">
                        <Languages className="mr-2 h-4 w-4" />
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
                        className="min-w-[140px] flex-1 bg-red-500 text-white transition hover:bg-red-600"
                        size="lg"
                      >
                        <Link
                          href="/logout"
                          onClick={() => setIsOpen(false)}
                          className="flex items-center justify-center space-x-2"
                        >
                          <LogOut className="h-4 w-4" />
                          <span>{t.nav.logout}</span>
                        </Link>
                      </Button>
                    ) : (
                      <Button
                        asChild
                        variant="outline"
                        className="min-w-[140px] flex-1 border-white/20 bg-white/10 text-white transition hover:bg-white/20"
                        size="lg"
                      >
                        <Link
                          href="/login"
                          onClick={() => setIsOpen(false)}
                          className="flex items-center justify-center space-x-2"
                        >
                          <LogIn className="h-4 w-4" />
                          <span>{t.nav.login}</span>
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {mobileAppItems.map(item => (
                    <Link
                      key={item.key}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="block rounded-xl border border-white/10 bg-white/5 p-4 transition hover:border-purple-300/60 hover:bg-white/10"
                    >
                      <div className="text-sm font-semibold">{item.title}</div>
                      <p className="mt-1 text-xs text-white/70">{item.description}</p>
                    </Link>
                  ))}
                </div>

                <div className="mt-10 space-y-6">
                  {presentationLinks[0] ? (
                    <Link
                      href={presentationLinks[0].href}
                      onClick={() => setIsOpen(false)}
                      className="block rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold transition hover:border-purple-300/60 hover:bg-white/10"
                    >
                      {presentationLinks[0].title}
                    </Link>
                  ) : null}
                  {user && (
                    <Link
                      href="/admin"
                      onClick={() => setIsOpen(false)}
                      className="block rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold transition hover:border-purple-300/60 hover:bg-white/10"
                    >
                      {t.nav.admin}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
