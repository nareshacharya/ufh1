
import { Role } from './rbac';

export interface UserSession {
  id: string;
  email: string;
  name: string;
  role: Role;
  isAuthenticated: boolean;
  isSharedLink?: boolean;
}

/**
 * Check if current URL is a shared link
 */
function isSharedLinkAccess(): boolean {
  if (typeof window === 'undefined') return false;
  
  const url = new URL(window.location.href);
  return url.searchParams.has('share') || url.searchParams.has('shared') || url.hash.includes('#shared');
}

/**
 * Get shared link token from URL
 */
function getSharedLinkToken(): string | null {
  if (typeof window === 'undefined') return null;
  
  const url = new URL(window.location.href);
  return url.searchParams.get('share') || url.searchParams.get('shared') || null;
}

/**
 * Validate shared link and get associated permissions
 */
function validateSharedLink(token: string): { isValid: boolean; role: Role } | null {
  // In production, this would validate the token against your backend
  // For demo purposes, we'll accept any token and grant admin access for shared links
  
  if (!token) return null;
  
  // Mock validation - in production this would be a secure token check
  return {
    isValid: true,
    role: 'Admin' // Grant admin permissions for shared links
  };
}

/**
 * Stub function to get current user session
 * In production, this would read from httpOnly cookie or JWT claims
 * @returns Promise<UserSession | null>
 */
export async function getCurrentUser(): Promise<UserSession | null> {
  // TODO: Replace with actual session reading from httpOnly cookie
  // This is a placeholder implementation for development
  
  if (typeof window === 'undefined') {
    // Server-side: would read from cookie in headers
    return null;
  }

  // Always return null on login page to ensure proper authentication flow
  const currentPath = window.location.pathname;
  if (currentPath === '/login') {
    return null;
  }

  // Check if this is a shared link access
  if (isSharedLinkAccess()) {
    const token = getSharedLinkToken();
    if (token) {
      const sharedLinkAuth = validateSharedLink(token);
      if (sharedLinkAuth?.isValid) {
        // Return admin user for shared link access
        const sharedUser: UserSession = {
          id: 'shared-admin',
          email: 'shared@perfumery.com',
          name: 'Shared Admin',
          role: sharedLinkAuth.role,
          isAuthenticated: true,
          isSharedLink: true
        };
        
        // Store shared link session temporarily
        sessionStorage.setItem('shared_link_authenticated', 'true');
        sessionStorage.setItem('shared_link_role', sharedLinkAuth.role);
        
        await new Promise(resolve => setTimeout(resolve, 100));
        return sharedUser;
      }
    }
  }

  // Check for shared link session
  const hasSharedSession = sessionStorage.getItem('shared_link_authenticated') === 'true';
  if (hasSharedSession) {
    const sharedRole = sessionStorage.getItem('shared_link_role') as Role || 'Admin';
    const sharedUser: UserSession = {
      id: 'shared-admin',
      email: 'shared@perfumery.com',
      name: 'Shared Admin',
      role: sharedRole,
      isAuthenticated: true,
      isSharedLink: true
    };
    
    await new Promise(resolve => setTimeout(resolve, 100));
    return sharedUser;
  }

  // Check if user has completed login flow
  const hasSession = sessionStorage.getItem('demo_authenticated') === 'true';
  
  if (!hasSession) {
    return null;
  }

  // Get stored user details from sessionStorage
  const userRole = sessionStorage.getItem('user_role') as Role || 'Admin';
  const userName = sessionStorage.getItem('user_name') || 'Admin User';
  const userEmail = sessionStorage.getItem('user_email') || 'admin@perfumery.com';

  // Return actual user session with stored details
  const mockUser: UserSession = {
    id: '1',
    email: userEmail,
    name: userName,
    role: userRole,
    isAuthenticated: true,
    isSharedLink: false
  };

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 100));

  return mockUser;
}

/**
 * Get current user role
 * @returns Promise<Role | null>
 */
export async function getCurrentUserRole(): Promise<Role | null> {
  const user = await getCurrentUser();
  return user?.role || null;
}

/**
 * Check if user is authenticated
 * @returns Promise<boolean>
 */
export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser();
  return user?.isAuthenticated || false;
}

/**
 * Stub function to check if session is valid
 * In production, this would validate the httpOnly cookie
 * @returns Promise<boolean>
 */
export async function isSessionValid(): Promise<boolean> {
  // TODO: Implement actual session validation
  // This would check if the httpOnly cookie exists and is valid
  
  if (typeof window === 'undefined') {
    return false;
  }

  // Always return false on login page
  const currentPath = window.location.pathname;
  if (currentPath === '/login') {
    return false;
  }

  // Check for shared link access first
  if (isSharedLinkAccess() || sessionStorage.getItem('shared_link_authenticated') === 'true') {
    return true;
  }

  // Check demo session
  return sessionStorage.getItem('demo_authenticated') === 'true';
}

/**
 * Stub function to clear user session
 * In production, this would clear the httpOnly cookie
 */
export function clearSession(): void {
  // TODO: Implement actual session clearing
  // This would clear the httpOnly cookie by calling the logout endpoint
  
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('demo_authenticated');
    sessionStorage.removeItem('shared_link_authenticated');
    sessionStorage.removeItem('shared_link_role');
    sessionStorage.removeItem('user_role');
    sessionStorage.removeItem('user_name');
    sessionStorage.removeItem('user_email');
    localStorage.removeItem('demo_session');
  }
  
  console.log('Session cleared (stub implementation)');
}

/**
 * Demo function to simulate login
 */
export function setDemoSession(): void {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('demo_authenticated', 'true');
  }
}

/**
 * Generate a shareable link for the current page
 */
export function generateShareableLink(): string {
  if (typeof window === 'undefined') return '';
  
  const currentUrl = new URL(window.location.href);
  // Add shared parameter to maintain admin permissions
  currentUrl.searchParams.set('shared', 'admin-access');
  
  return currentUrl.toString();
}

/**
 * Check if current session is from a shared link
 */
export function isSharedLinkSession(): boolean {
  if (typeof window === 'undefined') return false;
  return sessionStorage.getItem('shared_link_authenticated') === 'true' || isSharedLinkAccess();
}

/**
 * Hook to get current user session (client-side)
 */
export function useCurrentUser() {
  // This would be implemented as a React hook in production
  // For now, it's a placeholder
  return {
    user: null,
    loading: false,
    error: null
  };
}
