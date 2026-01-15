'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { Loader2 } from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export function AuthGuard({ children, requireAdmin = false }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      // Not authenticated, redirect to login with return URL
      setIsRedirecting(true);
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    if (requireAdmin && !isAdmin) {
      // Authenticated but not admin, redirect to home
      setIsRedirecting(true);
      router.push('/');
      return;
    }
  }, [isAuthenticated, isAdmin, isLoading, router, pathname, requireAdmin]);

  // Show loading state while checking auth or redirecting
  if (
    isLoading ||
    isRedirecting ||
    !isAuthenticated ||
    (requireAdmin && !isAdmin)
  ) {
    let message = 'Verificando autenticación...';
    if (isRedirecting && !isAuthenticated) {
      message = 'Redirigiendo al login...';
    } else if (isRedirecting && requireAdmin && !isAdmin) {
      message = 'Redirigiendo a inicio...';
    } else if (isRedirecting) {
      message = 'Redirigiendo...';
    }

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto" />
          <p className="mt-4 text-gray-600">{message}</p>
          {!isAuthenticated && !isLoading && (
            <p className="mt-2 text-sm text-gray-500">
              Necesitas iniciar sesión para acceder a esta página
            </p>
          )}
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
