'use client';

import type { User } from 'firebase/auth';
import { useI18n } from '@/lib/i18n';
import { DesktopNavbar } from './DesktopNavbar';
import { MobileMenu } from './MobileMenu';
import { createAppItems, createPresentationLinks } from './menu-options';

interface NavbarProps {
  user?: User | null;
  loading?: boolean;
}

export default function NavBar({ user, loading }: NavbarProps) {
  const { language, setLanguage, t } = useI18n();

  if (loading) {
    return null;
  }

  const appItems = createAppItems(t);
  const presentationLinks = createPresentationLinks(t);

  return (
    <>
      <DesktopNavbar
        appItems={appItems}
        presentationLinks={presentationLinks}
        user={user}
        language={language}
        setLanguage={setLanguage}
        t={t}
      />
      <MobileMenu
        appItems={appItems}
        presentationLinks={presentationLinks}
        user={user}
        language={language}
        setLanguage={setLanguage}
        t={t}
      />
    </>
  );
}
