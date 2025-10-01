
'use client';

import { useState, useEffect, useCallback } from 'react';
import { getCurrentUser, UserSession, clearSession, setDemoSession, isSharedLinkSession } from '../lib/auth/session';

interface UseAuthReturn {
  user: UserSession | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isSharedLink: boolean;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  const loadUser = useCallback(async () => {
    if (initialized) return;

    try {
      setLoading(true);
      setError(null);
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load user');
      setUser(null);
    } finally {
      setLoading(false);
      setInitialized(true);
    }
  }, [initialized]);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);

      console.log('Login attempt:', { email });

      if (email === 'admin@perfumery.com' && password === 'password123') {
        setDemoSession();

        const mockUser: UserSession = {
          id: '1',
          email,
          name: 'Admin User',
          role: 'Admin',
          isAuthenticated: true,
          isSharedLink: false
        };

        // Store user details in session storage for retrieval by getCurrentUserRole()
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('user_role', mockUser.role);
          sessionStorage.setItem('user_name', mockUser.name);
          sessionStorage.setItem('user_email', mockUser.email);
        }

        setUser(mockUser);
      } else {
        throw new Error('Invalid credentials. Use admin@perfumery.com / password123');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      setError(null);

      clearSession();
      setUser(null);

      if (isSharedLinkSession()) {
        window.location.reload();
        return;
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Logout failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!user?.isAuthenticated,
    isSharedLink: user?.isSharedLink || false
  };
}
