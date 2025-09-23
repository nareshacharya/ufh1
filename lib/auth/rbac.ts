
export type Role = 'Perfumer' | 'PaletteManager' | 'ComplianceOfficer' | 'ProjectManager' | 'Admin';

export type Permission = 
  | 'ingredients:read'
  | 'ingredients:write'
  | 'ingredients:delete'
  | 'formulas:read'
  | 'formulas:write'
  | 'formulas:delete'
  | 'projects:read'
  | 'projects:write'
  | 'projects:delete'
  | 'compliance:read'
  | 'compliance:write'
  | 'compliance:approve'
  | 'users:read'
  | 'users:write'
  | 'users:delete'
  | 'admin:all';

export interface RolePermissions {
  [key: string]: Permission[];
}

export const rolePermissions: RolePermissions = {
  Perfumer: [
    'ingredients:read',
    'ingredients:write',
    'formulas:read',
    'formulas:write',
    'projects:read',
    'compliance:read'
  ],
  PaletteManager: [
    'ingredients:read',
    'ingredients:write',
    'ingredients:delete',
    'formulas:read',
    'projects:read',
    'compliance:read'
  ],
  ComplianceOfficer: [
    'ingredients:read',
    'formulas:read',
    'projects:read',
    'compliance:read',
    'compliance:write',
    'compliance:approve'
  ],
  ProjectManager: [
    'ingredients:read',
    'formulas:read',
    'formulas:write',
    'projects:read',
    'projects:write',
    'projects:delete',
    'compliance:read',
    'users:read'
  ],
  Admin: [
    'admin:all',
    'ingredients:read',
    'ingredients:write',
    'ingredients:delete',
    'formulas:read',
    'formulas:write',
    'formulas:delete',
    'projects:read',
    'projects:write',
    'projects:delete',
    'compliance:read',
    'compliance:write',
    'compliance:approve',
    'users:read',
    'users:write',
    'users:delete'
  ]
};

/**
 * Check if a role has a specific permission
 * @param role - User role
 * @param permission - Permission to check
 * @returns boolean indicating if role has permission
 */
export function can(role: Role, permission: Permission): boolean {
  const permissions = rolePermissions[role];
  
  if (!permissions) {
    return false;
  }

  // Admin has all permissions
  if (role === 'Admin') {
    return true;
  }

  return permissions.includes(permission);
}

/**
 * Check if a role can access a specific route
 * @param role - User role
 * @param requiredRoles - Array of roles that can access the route
 * @returns boolean indicating if role can access route
 */
export function canAccessRoute(role: Role, requiredRoles?: Role[]): boolean {
  if (!requiredRoles || requiredRoles.length === 0) {
    return true; // Public route
  }

  // Admin can access everything
  if (role === 'Admin') {
    return true;
  }

  return requiredRoles.includes(role);
}

/**
 * Get all permissions for a role
 * @param role - User role
 * @returns Array of permissions
 */
export function getPermissions(role: Role): Permission[] {
  return rolePermissions[role] || [];
}

/**
 * Check if user has any of the specified permissions
 * @param role - User role
 * @param permissions - Array of permissions to check
 * @returns boolean indicating if user has at least one permission
 */
export function hasAnyPermission(role: Role, permissions: Permission[]): boolean {
  return permissions.some(permission => can(role, permission));
}

/**
 * Check if user has all of the specified permissions
 * @param role - User role
 * @param permissions - Array of permissions to check
 * @returns boolean indicating if user has all permissions
 */
export function hasAllPermissions(role: Role, permissions: Permission[]): boolean {
  return permissions.every(permission => can(role, permission));
}
