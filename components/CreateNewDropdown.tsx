
'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { getCurrentUserRole } from '../lib/auth/session';
import { Role } from '../lib/auth/rbac';

interface CaseType {
  id: string;
  name: string;
  href: string;
  icon: string;
  roles: Role[];
  description: string;
}

const caseTypes: CaseType[] = [
  {
    id: 'ingredient',
    name: 'New Ingredient',
    href: '/case/new/Ingredient',
    icon: 'ri-flask-line',
    roles: ['Perfumer', 'PaletteManager', 'Admin'],
    description: 'Create a new fragrance ingredient'
  },
  {
    id: 'formula',
    name: 'New Formula',
    href: '/case/new/Formula', 
    icon: 'ri-test-tube-line',
    roles: ['Perfumer', 'Admin'],
    description: 'Create a new fragrance formula'
  },
  {
    id: 'project',
    name: 'New Project',
    href: '/case/new/Project',
    icon: 'ri-folder-add-line',
    roles: ['ProjectManager', 'Admin'],
    description: 'Create a new project'
  },
  {
    id: 'palette',
    name: 'New Palette',
    href: '/case/new/Palette',
    icon: 'ri-palette-line',
    roles: ['PaletteManager', 'Perfumer', 'Admin'],
    description: 'Create a new palette collection'
  },
  {
    id: 'compliance',
    name: 'Compliance Run',
    href: '/case/new/Compliance',
    icon: 'ri-shield-check-line',
    roles: ['ComplianceOfficer', 'Perfumer', 'Admin'],
    description: 'Start compliance analysis'
  }
];

interface CreateNewDropdownProps {
  trigger: React.ReactNode;
  className?: string;
}

export function CreateNewDropdown({ trigger, className = '' }: CreateNewDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [userRole, setUserRole] = useState<Role | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getCurrentUserRole().then(role => {
      setUserRole(role);
    });
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getAccessibleCaseTypes = () => {
    if (!userRole) return [];
    return caseTypes.filter(caseType => caseType.roles.includes(userRole));
  };

  const accessibleCaseTypes = getAccessibleCaseTypes();

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>
      
      {isOpen && (
        <div 
          className="absolute right-0 top-full mt-2 w-80 rounded-lg shadow-lg border z-50 animate-slide-up"
          style={{
            background: 'rgb(var(--bg-primary)) !important',
            border: '1px solid rgb(var(--border-primary)) !important',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
          }}
        >
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-3" style={{ color: 'rgb(var(--fg-primary)) !important' }}>
              Create New
            </h3>
            <div className="space-y-1">
              {accessibleCaseTypes.length > 0 ? (
                accessibleCaseTypes.map((caseType) => (
                  <Link
                    key={caseType.id}
                    href={caseType.href}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-rgb(var(--bg-tertiary)) transition-colors group"
                    onClick={() => setIsOpen(false)}
                  >
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform" 
                         style={{ background: 'rgb(var(--primary) / 0.1) !important' }}>
                      <i className={`${caseType.icon} text-lg`} style={{ color: 'rgb(var(--primary)) !important' }}></i>
                    </div>
                    <div className="flex-1">
                      <div className="font-medium" style={{ color: 'rgb(var(--fg-primary)) !important' }}>
                        {caseType.name}
                      </div>
                      <div className="text-sm" style={{ color: 'rgb(var(--fg-tertiary)) !important' }}>
                        {caseType.description}
                      </div>
                    </div>
                    <div className="w-4 h-4 flex items-center justify-center">
                      <i className="ri-arrow-right-line group-hover:translate-x-1 transition-transform" 
                         style={{ color: 'rgb(var(--fg-quaternary)) !important' }}></i>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="text-center py-6">
                  <i className="ri-lock-line text-3xl mb-3" style={{ color: 'rgb(var(--fg-quaternary)) !important' }}></i>
                  <div className="text-sm font-medium mb-1" style={{ color: 'rgb(var(--fg-primary)) !important' }}>
                    No Access
                  </div>
                  <div className="text-xs" style={{ color: 'rgb(var(--fg-tertiary)) !important' }}>
                    Contact your administrator for permissions
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}