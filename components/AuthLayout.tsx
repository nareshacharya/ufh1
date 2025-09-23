'use client';

import { usePathname } from 'next/navigation';
import { TopNavigation } from './TopNavigation';
import { useAuth } from '../hooks/useAuth';

const publicRoutes = ['/login'];

export function AuthLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();
  const isPublicRoute = publicRoutes.includes(pathname);

  // For login page, don't show the navigation
  if (isPublicRoute || !isAuthenticated) {
    return <>{children}</>;
  }

  // For authenticated pages, show top navigation
  return (
    <div className="min-h-screen" style={{ background: 'rgb(var(--bg-primary)) !important' }}>
      <TopNavigation />
      <main className="px-6 py-6">
        {children}
      </main>
    </div>
  );
}