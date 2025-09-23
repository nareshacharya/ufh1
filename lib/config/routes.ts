
import { Role } from '../auth/rbac';

export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon?: string;
  badge?: string;
  roles?: Role[]; // Optional roles that can access this route
}

export interface NavConfig {
  primary: NavItem[];
  secondary: NavItem[];
}

export const routeConfig: NavConfig = {
  primary: [
    {
      id: 'home',
      label: 'Home',
      href: '/',
      icon: 'ri-home-line',
      // No roles means accessible to all authenticated users
    },
    {
      id: 'create-new',
      label: 'Create New',
      href: '/create',
      icon: 'ri-add-circle-line',
      roles: ['Perfumer', 'PaletteManager', 'ProjectManager', 'Admin'],
    },
    {
      id: 'ingredients',
      label: 'Ingredients',
      href: '/ingredients',
      icon: 'ri-flask-line',
      // All roles can read ingredients
    },
    {
      id: 'formulas',
      label: 'Formulas',
      href: '/formulas',
      icon: 'ri-file-list-3-line',
      // All roles can access formulas (with different permissions)
    },
    {
      id: 'projects',
      label: 'Projects',
      href: '/projects',
      icon: 'ri-folder-line',
      // All roles can access projects (with different permissions)
    },
    {
      id: 'compliance',
      label: 'Compliance',
      href: '/compliance',
      icon: 'ri-shield-check-line',
      // All roles can read compliance data
    },
  ],
  secondary: [
    {
      id: 'profile',
      label: 'Profile',
      href: '/profile',
      icon: 'ri-user-line',
      // All authenticated users can access profile
    },
    {
      id: 'settings',
      label: 'Settings',
      href: '/settings',
      icon: 'ri-settings-line',
      // All authenticated users can access settings
    },
    {
      id: 'notifications',
      label: 'Notifications',
      href: '/notifications',
      icon: 'ri-notification-line',
      badge: '3',
      // All authenticated users can access notifications
    },
    {
      id: 'admin',
      label: 'Admin',
      href: '/admin',
      icon: 'ri-admin-line',
      roles: ['Admin'], // Only Admin can access
    },
    {
      id: 'user-management',
      label: 'User Management',
      href: '/admin/users',
      icon: 'ri-group-line',
      roles: ['Admin', 'ProjectManager'], // Admin and ProjectManager can access
    },
    {
      id: 'logout',
      label: 'Logout',
      href: '/logout',
      icon: 'ri-logout-box-line',
      // All authenticated users can logout
    },
  ],
};

// Legacy routes for backward compatibility
export const routes = {
  primary: [
    { path: '/', label: 'Home', icon: 'ri-home-4-line' },
    { path: '/create', label: 'Create New', icon: 'ri-add-circle-line' },
    { path: '/features/ingredients', label: 'Ingredients', icon: 'ri-flask-line' },
    { path: '/formulas', label: 'Formulas', icon: 'ri-file-list-3-line' },
    { path: '/projects', label: 'Projects', icon: 'ri-folder-line' },
    { path: '/compliance', label: 'Compliance', icon: 'ri-shield-check-line' }
  ],
  secondary: [
    { path: '/profile', label: 'Profile', icon: 'ri-user-line' },
    { path: '/settings', label: 'Settings', icon: 'ri-settings-3-line' },
    { path: '/notifications', label: 'Notifications', icon: 'ri-notification-3-line', badge: 3 },
    { path: '/logout', label: 'Logout', icon: 'ri-logout-box-line' }
  ]
};

export const CASE_CREATION_ROUTES: NavItem[] = [
  {
    id: 'create_ingredient',
    name: 'New Ingredient',
    href: '/case/new/Ingredient',
    icon: 'ri-flask-line',
    roles: ['Perfumer', 'PaletteManager', 'Admin']
  },
  {
    id: 'create_project',
    name: 'New Project',
    href: '/case/new/Project',
    icon: 'ri-folder-add-line',
    roles: ['ProjectManager', 'Admin']
  },
  {
    id: 'create_formula',
    name: 'New Formula',
    href: '/case/new/Formula',
    icon: 'ri-test-tube-line',
    roles: ['Perfumer', 'Admin']
  },
  {
    id: 'create_palette',
    name: 'New Palette',
    href: '/case/new/Palette',
    icon: 'ri-palette-line',
    roles: ['PaletteManager', 'Perfumer', 'Admin']
  }
];

// Update main navigation to include case creation
export const MAIN_NAV: NavItem[] = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    href: '/',
    icon: 'ri-dashboard-line'
  },
  {
    id: 'ingredients',
    name: 'Ingredients',
    href: '/features/ingredients',
    icon: 'ri-leaf-line',
    roles: ['Perfumer', 'PaletteManager', 'ComplianceOfficer', 'Admin']
  },
  {
    id: 'create_new',
    name: 'Create New',
    href: '#',
    icon: 'ri-add-circle-line',
    children: CASE_CREATION_ROUTES,
    roles: ['Perfumer', 'PaletteManager', 'ProjectManager', 'Admin']
  },
  {
    id: 'home',
    label: 'Home',
    href: '/',
    icon: 'ri-home-line',
    // No roles means accessible to all authenticated users
  },
  {
    id: 'create-new',
    label: 'Create New',
    href: '/create',
    icon: 'ri-add-circle-line',
    roles: ['Perfumer', 'PaletteManager', 'ProjectManager', 'Admin'],
  },
  {
    id: 'ingredients',
    label: 'Ingredients',
    href: '/ingredients',
    icon: 'ri-flask-line',
    // All roles can read ingredients
  },
  {
    id: 'formulas',
    label: 'Formulas',
    href: '/formulas',
    icon: 'ri-file-list-3-line',
    // All roles can access formulas (with different permissions)
  },
  {
    id: 'projects',
    label: 'Projects',
    href: '/projects',
    icon: 'ri-folder-line',
    // All roles can access projects (with different permissions)
  },
  {
    id: 'compliance',
    label: 'Compliance',
    href: '/compliance',
    icon: 'ri-shield-check-line',
    // All roles can read compliance data
  },
  {
    id: 'profile',
    label: 'Profile',
    href: '/profile',
    icon: 'ri-user-line',
    // All authenticated users can access profile
  },
  {
    id: 'settings',
    label: 'Settings',
    href: '/settings',
    icon: 'ri-settings-line',
    // All authenticated users can access settings
  },
  {
    id: 'notifications',
    label: 'Notifications',
    href: '/notifications',
    icon: 'ri-notification-line',
    badge: '3',
    // All authenticated users can access notifications
  },
  {
    id: 'admin',
    label: 'Admin',
    href: '/admin',
    icon: 'ri-admin-line',
    roles: ['Admin'],
    // Only Admin can access
  },
  {
    id: 'user-management',
    label: 'User Management',
    href: '/admin/users',
    icon: 'ri-group-line',
    roles: ['Admin', 'ProjectManager'],
    // Admin and ProjectManager can access
  },
  {
    id: 'logout',
    label: 'Logout',
    href: '/logout',
    icon: 'ri-logout-box-line',
    // All authenticated users can logout
  },
  {
    id: 'admin',
    name: 'Admin',
    href: '/admin',
    icon: 'ri-settings-line',
    roles: ['Admin'],
    children: [
      {
        id: 'admin_panel',
        name: 'Admin Panel',
        href: '/admin/panel',
        icon: 'ri-admin-line',
        roles: ['Admin']
      },
      {
        id: 'user_management',
        name: 'User Management',
        href: '/admin/users',
        icon: 'ri-user-settings-line',
        roles: ['Admin']
      }
    ]
  }
];
