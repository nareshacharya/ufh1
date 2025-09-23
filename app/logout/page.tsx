
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { clearSession } from '@/lib/auth/session';

export default function LogoutPage() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(true);

  useEffect(() => {
    const performLogout = async () => {
      try {
        setIsLoggingOut(true);
        
        // Clear all session data
        clearSession();
        
        // Clear any additional session storage items
        if (typeof window !== 'undefined') {
          sessionStorage.removeItem('demo_authenticated');
          sessionStorage.removeItem('shared_link_authenticated');
          sessionStorage.removeItem('shared_link_role');
          sessionStorage.removeItem('user_role');
          sessionStorage.removeItem('user_name');
          sessionStorage.removeItem('user_email');
          localStorage.removeItem('demo_session');
        }
        
        // Small delay to ensure session is cleared properly
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Force redirect to login page
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        } else {
          router.push('/login');
        }
      } catch (error) {
        console.error('Logout error:', error);
        // Force redirect even if there's an error
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        } else {
          router.push('/login');
        }
      }
    };

    // Start logout process immediately
    performLogout();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'rgb(var(--bg-primary))' }}>
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-primary rounded-full animate-spin mx-auto mb-6"></div>
        <div className="text-lg font-medium mb-2" style={{ color: 'rgb(var(--fg-primary))' }}>
          Signing out...
        </div>
        <div className="text-sm" style={{ color: 'rgb(var(--fg-tertiary))' }}>
          Please wait while we log you out securely
        </div>
      </div>
    </div>
  );
}
