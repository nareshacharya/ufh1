
'use client';

import { useState, useEffect } from 'react';
import { Role, Permission, canAccessRoute, can } from '../lib/auth/rbac';
import { getCurrentUserRole, getCurrentUser } from '../lib/auth/session';

interface UseRBACReturn {
  role: Role | null;
  loading: boolean;
  hasPermission: (permission: Permission) => boolean;
  canAccess: (allowedRoles?: Role[]) => boolean;
  canPerformAction: (action: string, context?: any) => boolean;
  isSharedLink: boolean;
}

export function useRBAC(): UseRBACReturn {
  const [role, setRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSharedLink, setIsSharedLink] = useState(false);

  useEffect(() => {
    loadUserRole();
  }, []);

  const loadUserRole = async () => {
    try {
      setLoading(true);
      const currentUser = await getCurrentUser();
      const userRole = currentUser?.role || null;
      const sharedLinkStatus = currentUser?.isSharedLink || false;
      
      setRole(userRole);
      setIsSharedLink(sharedLinkStatus);
    } catch (error) {
      console.error('Failed to load user role:', error);
      setRole(null);
      setIsSharedLink(false);
    } finally {
      setLoading(false);
    }
  };

  const hasPermission = (permission: Permission): boolean => {
    if (!role) return false;
    
    // Shared links with Admin role should have full permissions
    if (isSharedLink && role === 'Admin') return true;
    
    return can(role, permission);
  };

  const canAccess = (allowedRoles?: Role[]): boolean => {
    if (!role) return false;
    if (!allowedRoles || allowedRoles.length === 0) return true;
    
    // Shared links with Admin role can access everything
    if (isSharedLink && role === 'Admin') return true;
    
    return canAccessRoute(role, allowedRoles);
  };

  const canPerformAction = (action: string, context?: any): boolean => {
    if (!role) return false;
    
    // Shared links with Admin role have full permissions
    if (isSharedLink && role === 'Admin') return true;
    
    // Admin has all permissions
    if (role === 'Admin') return true;
    
    // Enhanced action permission check based on role and context
    switch (action) {
      case 'create':
      case 'create_case':
        return ['Perfumer', 'PaletteManager', 'ProjectManager', 'ComplianceOfficer', 'Admin'].includes(role);
      
      case 'create_ingredient':
        return ['Perfumer', 'PaletteManager', 'Admin'].includes(role);
      
      case 'create_formula':
        return ['Perfumer', 'Admin'].includes(role);
      
      case 'create_project':
        return ['ProjectManager', 'Admin'].includes(role);
      
      case 'create_palette':
        return ['PaletteManager', 'Perfumer', 'Admin'].includes(role);
      
      case 'create_compliance':
        return ['ComplianceOfficer', 'Perfumer', 'Admin'].includes(role);
      
      case 'view':
      case 'read':
        return true; // All authenticated users can view
      
      case 'edit':
      case 'update':
        // Context-based permission, for now allow all authenticated users
        return ['Perfumer', 'PaletteManager', 'ProjectManager', 'ComplianceOfficer', 'Admin'].includes(role);
      
      case 'delete':
        // More restrictive - only certain roles can delete
        return ['Admin', 'ProjectManager'].includes(role);
      
      case 'approve':
        return ['Admin', 'ComplianceOfficer'].includes(role);
      
      case 'export':
        return ['Perfumer', 'PaletteManager', 'ProjectManager', 'ComplianceOfficer', 'Admin'].includes(role);
      
      case 'share':
        // All authenticated users can create shareable links
        return true;
      
      default:
        // Default to allowing action for authenticated users
        return true;
    }
  };

  return {
    role,
    loading,
    hasPermission,
    canAccess,
    canPerformAction,
    isSharedLink
  };
}
