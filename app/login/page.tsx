import { Suspense } from 'react';
import { LoginForm } from './login-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center px-4">
          <Card className="w-full max-w-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-leiden">Sign In</CardTitle>
              <CardDescription>Loading...</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="animate-pulse space-y-4">
                <div className="h-10 rounded bg-gray-200" />
                <div className="h-10 rounded bg-gray-200" />
                <div className="h-10 rounded bg-gray-200" />
              </div>
            </CardContent>
          </Card>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
