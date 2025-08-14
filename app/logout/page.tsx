'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth, signOut } from 'firebase/auth';
import firebaseApp from '@/lib/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export default function LogoutPage() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const performLogout = async () => {
      if (isLoggingOut) return; // Prevent multiple calls

      setIsLoggingOut(true);

      try {
        // Clear the auth cookie
        await fetch('/api/logout', {
          method: 'POST',
        });

        // Sign out from Firebase
        const auth = getAuth(firebaseApp);
        await signOut(auth);

        router.push('/');
      } catch (error) {
        console.error('Logout error:', error);
        router.push('/');
      }
    };

    performLogout();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); //TODO: fix properly 

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Logging Out</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin text-leiden" />
          <p className="text-muted-foreground">Please wait while we log you out...</p>
        </CardContent>
      </Card>
    </div>
  );
}
