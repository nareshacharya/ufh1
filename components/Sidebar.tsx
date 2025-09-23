
'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { routeConfig } from '../lib/config/routes';
import { appConfig } from '../lib/config/appConfig';
import { ThemeToggle } from './ThemeToggle';
import { canAccessRoute, Role } from '../lib/auth/rbac';
import { getCurrentUserRole } from '../lib/auth/session';
import { useAuth } from '../hooks/useAuth';

interface CaseType {
  id: string;
  name: string;
  href: string;
  icon: string;
  roles: Role[];
}

const caseTypes: CaseType[] = [
  {
    id: 'ingredient',
    name: 'New Ingredient',
    href: '/case/new/Ingredient',
    icon: 'ri-flask-line',
    roles: ['Perfumer', 'PaletteManager', 'Admin']
  },
  {
    id: 'formula',
    name: 'New Formula',
    href: '/case/new/Formula',
    icon: 'ri-test-tube-line',
    roles: ['Perfumer', 'Admin']
  },
  {
    id: 'project',
    name: 'New Project',
    href: '/case/new/Project',
    icon: 'ri-folder-add-line',
    roles: ['ProjectManager', 'Admin']
  },
  {
    id: 'palette',
    name: 'New Palette',
    href: '/case/new/Palette',
    icon: 'ri-palette-line',
    roles: ['PaletteManager', 'Perfumer', 'Admin']
  },
  {
    id: 'compliance',
    name: 'Compliance Run',
    href: '/case/new/Compliance',
    icon: 'ri-shield-check-line',
    roles: ['ComplianceOfficer', 'Perfumer', 'Admin']
  }
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCreateDropdownOpen, setIsCreateDropdownOpen] = useState(false);
  const [userRole, setUserRole] = useState<Role | null>(null);
  const [tooltip, setTooltip] = useState<{ show: boolean; text: string; x: number; y: number }>({
    show: false,
    text: '',
    x: 0,
    y: 0
  });
  const sidebarRef = useRef<HTMLElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const createDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getCurrentUserRole().then(role => {
      setUserRole(role);
    });
  }, []);

  // Close sidebar when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (isExpanded && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
        setIsCreateDropdownOpen(false);
      }
      // Close dropdown when clicking outside
      if (isCreateDropdownOpen && createDropdownRef.current && !createDropdownRef.current.contains(event.target as Node)) {
        setIsCreateDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExpanded, isCreateDropdownOpen]);

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  const getFilteredNavItems = (items: typeof routeConfig.primary) => {
    if (!userRole) return items;
    return items.filter(item => canAccessRoute(userRole, item.roles));
  };

  const getAccessibleCaseTypes = () => {
    if (!userRole) return [];
    return caseTypes.filter(caseType => caseType.roles.includes(userRole));
  };

  const showTooltip = (text: string, event: React.MouseEvent) => {
    if (isExpanded) return; // Don't show tooltip when sidebar is expanded
    
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    setTooltip({
      show: true,
      text,
      x: rect.right + 8,
      y: rect.top + (rect.height / 2)
    });
  };

  const hideTooltip = () => {
    setTooltip({ show: false, text: '', x: 0, y: 0 });
  };

  const handleLogout = async () => {
    try {
      await logout();
      // Clear both session storage and local storage
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('demo_authenticated');
        localStorage.removeItem('demo_session');
      }
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const filteredPrimaryItems = getFilteredNavItems(routeConfig.primary);
  const filteredSecondaryItems = getFilteredNavItems(routeConfig.secondary);
  const accessibleCaseTypes = getAccessibleCaseTypes();

  return (
    <>
      {/* Overlay for mobile */}
      {isExpanded && (
        <div 
          className="fixed inset-0 bg-black/20 z-30 lg:hidden"
          onClick={() => setIsExpanded(false)}
        />
      )}

      {/* Tooltip */}
      {tooltip.show && (
        <div
          ref={tooltipRef}
          className="tooltip show"
          style={{
            left: tooltip.x,
            top: tooltip.y,
            transform: 'translateY(-50%)'
          }}
        >
          {tooltip.text}
          <div className="tooltip-arrow left"></div>
        </div>
      )}

      <aside 
        ref={sidebarRef}
        className={`fixed left-4 top-4 bottom-4 theme-transition z-40 rounded-2xl floating-sidebar ${
          isExpanded ? 'w-64' : 'w-16'
        }`}
      >
        {/* Header with Branding */}
        <div className="p-4 relative">
          <div className="flex items-center justify-center">
            {/* Brand Icon */}
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white bg-gradient-to-br from-purple-500 to-violet-600">
              <i className="ri-music-2-line text-lg"></i>
            </div>
            
            {isExpanded && (
              <div className="animate-fade-in ml-3 flex-1">
                <h1 
                  className="font-bold text-lg"
                  style={{ color: 'rgb(var(--fg-primary)) !important' }}
                >
                  Melody
                </h1>
                <p 
                  className="text-xs"
                  style={{ color: 'rgb(var(--fg-tertiary)) !important' }}
                >
                  Perfumery Platform
                </p>
              </div>
            )}
          </div>

          {/* Expand/Collapse Toggle - Moved down between logo and navigation */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="absolute -right-4 w-8 h-8 rounded-full flex items-center justify-center text-white hover:scale-105 transition-all duration-200 cursor-pointer shadow-lg z-50"
            style={{
              background: 'rgb(var(--primary)) !important',
              border: '2px solid rgb(var(--bg-primary))',
              top: '72px'
            }}
            aria-label={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            <i className={`${isExpanded ? 'ri-arrow-left-s-line' : 'ri-arrow-right-s-line'} text-base transition-transform duration-200`}></i>
          </button>
        </div>

        {/* Separator */}
        <div className="mx-4 mb-4 bg-shade-100 h-px"></div>

        {/* Navigation */}
        <nav className="p-3 space-y-2 flex-1 overflow-y-auto">
          {/* Home Link */}
          <Link 
            href="/" 
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 whitespace-nowrap ${
              pathname === '/' 
                ? 'text-white' 
                : 'hover:bg-shade-100'
            }`}
            style={pathname === '/' ? {
              background: 'rgb(var(--primary)) !important',
              color: 'white !important'
            } : {
              color: 'rgb(var(--fg-secondary)) !important'
            }}
            onMouseEnter={(e) => showTooltip('Home', e)}
            onMouseLeave={hideTooltip}
          >
            <div className="w-5 h-5 flex items-center justify-center">
              <i className="ri-home-line text-base"></i>
            </div>
            {isExpanded && <span className="font-medium">Home</span>}
          </Link>

          {/* Create New Dropdown */}
          <div className="relative" ref={createDropdownRef}>
            <button
              onClick={() => setIsCreateDropdownOpen(!isCreateDropdownOpen)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 whitespace-nowrap w-full ${
                pathname.startsWith('/case/new') || pathname === '/create'
                  ? 'text-white' 
                  : 'hover:bg-shade-100'
              }`}
              style={pathname.startsWith('/case/new') || pathname === '/create' ? {
                background: 'rgb(var(--primary)) !important',
                color: 'white !important'
              } : {
                color: 'rgb(var(--fg-secondary)) !important'
              }}
              onMouseEnter={!isExpanded ? (e) => showTooltip('Create New', e) : undefined}
              onMouseLeave={!isExpanded ? hideTooltip : undefined}
            >
              <div className="w-5 h-5 flex items-center justify-center">
                <i className="ri-add-circle-line text-base"></i>
              </div>
              {isExpanded && <span className="font-medium flex-1 text-left">Create New</span>}
              {isExpanded && (
                <div className="w-4 h-4 flex items-center justify-center">
                  <i className={`ri-arrow-${isCreateDropdownOpen ? 'up' : 'down'}-s-line text-sm transition-transform`}></i>
                </div>
              )}
            </button>
            
            {/* Dropdown Menu */}
            {isCreateDropdownOpen && (
              <div 
                className={`absolute z-50 bg-white rounded-lg shadow-lg animate-slide-up ${
                  isExpanded ? 'left-0 top-full mt-1 w-full' : 'left-full top-0 ml-2 w-64'
                }`}
                style={{
                  background: 'rgb(var(--bg-primary)) !important',
                  boxShadow: '0 10px 25px rgba(147, 51, 234, 0.1)'
                }}
              >
                <div className="py-2">
                  {accessibleCaseTypes.length > 0 ? (
                    accessibleCaseTypes.map((caseType) => (
                      <Link
                        key={caseType.id}
                        href={caseType.href}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-shade-100 transition-colors"
                        style={{ color: 'rgb(var(--fg-primary)) !important' }}
                        onClick={() => setIsCreateDropdownOpen(false)}
                      >
                        <div className="w-5 h-5 flex items-center justify-center">
                          <i className={`${caseType.icon} text-base`} style={{ color: 'rgb(var(--primary)) !important' }}></i>
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{caseType.name}</div>
                          <div className="text-xs" style={{ color: 'rgb(var(--fg-tertiary)) !important' }}>
                            Create a new {caseType.name.toLowerCase()}
                          </div>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-center">
                      <i className="ri-lock-line text-2xl mb-2" style={{ color: 'rgb(var(--fg-quaternary)) !important' }}></i>
                      <div className="text-sm font-medium" style={{ color: 'rgb(var(--fg-primary)) !important' }}>No Access</div>
                      <div className="text-xs" style={{ color: 'rgb(var(--fg-tertiary)) !important' }}>
                        Contact admin for permissions
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Regular Navigation Items */}
          {filteredPrimaryItems.filter(item => item.id !== 'home' && item.id !== 'create-new').map((item) => (
            <Link 
              key={item.id}
              href={item.href} 
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 whitespace-nowrap ${
                isActive(item.href) 
                  ? 'text-white' 
                  : 'hover:bg-shade-100'
              }`}
              style={isActive(item.href) ? {
                background: 'rgb(var(--primary)) !important',
                color: 'white !important'
              } : {
                color: 'rgb(var(--fg-secondary)) !important'
              }}
              onMouseEnter={(e) => showTooltip(item.label, e)}
              onMouseLeave={hideTooltip}
            >
              <div className="w-5 h-5 flex items-center justify-center">
                <i className={`${item.icon} text-base`}></i>
              </div>
              {isExpanded && <span className="font-medium">{item.label}</span>}
            </Link>
          ))}

          {/* Secondary Navigation */}
          {filteredSecondaryItems.length > 0 && (
            <div className="pt-4 mt-4">
              <div className="mx-4 mb-4 bg-shade-100 h-px"></div>
              {filteredSecondaryItems.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 whitespace-nowrap ${
                    isActive(item.href) 
                      ? 'text-white' 
                      : 'hover:bg-shade-100'
                  }`}
                  style={isActive(item.href) ? {
                    background: 'rgb(var(--primary)) !important',
                    color: 'white !important'
                  } : {
                    color: 'rgb(var(--fg-secondary)) !important'
                  }}
                  onMouseEnter={(e) => showTooltip(item.label, e)}
                  onMouseLeave={hideTooltip}
                >
                  <div className="w-5 h-5 flex items-center justify-center">
                    <i className={`${item.icon} text-base`}></i>
                  </div>
                  {isExpanded && <span className="font-medium">{item.label}</span>}
                </Link>
              ))}
            </div>
          )}
        </nav>

        {/* User Section */}
        {isExpanded && user && (
          <div className="p-4 animate-fade-in">
            <div className="mx-0 mb-4 bg-shade-100 h-px"></div>
            <div className="flex items-center gap-3 mb-3">
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{
                  background: 'rgb(var(--primary)) !important'
                }}
              >
                <span className="text-white text-sm font-medium">
                  {user.name?.charAt(0) || user.email?.charAt(0) || 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p 
                  className="font-medium text-sm truncate"
                  style={{ color: 'rgb(var(--fg-primary)) !important' }}
                >
                  {user.name || 'User'}
                </p>
                <p 
                  className="text-xs truncate"
                  style={{ color: 'rgb(var(--fg-tertiary)) !important' }}
                >
                  {user.email}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="modern-badge badge-primary text-xs">
                {user.role}
              </span>
              <div className="flex items-center gap-2">
                <ThemeToggle />
                <button
                  onClick={handleLogout}
                  className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-shade-100 transition-colors cursor-pointer"
                  style={{ color: 'rgb(var(--fg-secondary)) !important' }}
                  title="Logout"
                >
                  <i className="ri-logout-line text-sm"></i>
                </button>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}