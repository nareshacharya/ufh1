
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRBAC } from '@/hooks/useRBAC';
import { getCurrentUserRole } from '@/lib/auth/session';
import { Role } from '@/lib/auth/rbac';
import { Breadcrumb } from '@/components/Breadcrumb';

interface CaseType {
  id: string;
  name: string;
  description: string;
  icon: string;
  href: string;
  roles: Role[];
  category: string;
}

const caseTypes: CaseType[] = [
  {
    id: 'ingredient',
    name: 'New Ingredient',
    description: 'Create a new fragrance ingredient with properties and safety data',
    icon: 'ri-flask-line',
    href: '/case/new/Ingredient',
    roles: ['Perfumer', 'PaletteManager', 'Admin'],
    category: 'Materials'
  },
  {
    id: 'formula',
    name: 'New Formula',
    description: 'Create a new fragrance formula with ingredient composition',
    icon: 'ri-test-tube-line',
    href: '/case/new/Formula',
    roles: ['Perfumer', 'Admin'],
    category: 'Formulations'
  },
  {
    id: 'project',
    name: 'New Project',
    description: 'Create a new project with milestones and linked formulas',
    icon: 'ri-folder-add-line',
    href: '/case/new/Project',
    roles: ['ProjectManager', 'Admin'],
    category: 'Management'
  },
  {
    id: 'palette',
    name: 'New Palette',
    description: 'Create a new fragrance palette collection',
    icon: 'ri-palette-line',
    href: '/case/new/Palette',
    roles: ['PaletteManager', 'Perfumer', 'Admin'],
    category: 'Collections'
  },
  {
    id: 'compliance',
    name: 'Compliance Run',
    description: 'Start a new compliance analysis for regulatory review',
    icon: 'ri-shield-check-line',
    href: '/case/new/Compliance',
    roles: ['ComplianceOfficer', 'Perfumer', 'Admin'],
    category: 'Compliance'
  }
];

export default function CreatePage() {
  const { canPerformAction } = useRBAC();
  const [userRole, setUserRole] = useState<Role | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const breadcrumbItems = [
    { label: 'Home', href: '/', icon: 'ri-home-line' },
    { label: 'Create New Case', icon: 'ri-add-circle-line' }
  ];

  useEffect(() => {
    getCurrentUserRole().then(role => {
      setUserRole(role);
    });
  }, []);

  // Filter case types based on user role
  const accessibleCaseTypes = caseTypes.filter(caseType => 
    !userRole || caseType.roles.includes(userRole)
  );

  // Get unique categories
  const categories = ['all', ...new Set(accessibleCaseTypes.map(ct => ct.category))];

  // Filter by selected category
  const filteredCaseTypes = selectedCategory === 'all' 
    ? accessibleCaseTypes 
    : accessibleCaseTypes.filter(ct => ct.category === selectedCategory);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Materials': return 'ri-flask-line';
      case 'Formulations': return 'ri-test-tube-line';
      case 'Management': return 'ri-folder-line';
      case 'Collections': return 'ri-palette-line';
      case 'Compliance': return 'ri-shield-check-line';
      default: return 'ri-apps-line';
    }
  };

  if (!userRole) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p style={{ color: 'rgb(var(--fg-secondary)) !important' }}>Loading permissions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen">
      <div className="max-w-none space-y-6 animate-fade-in">
        {/* Header Panel */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <Breadcrumb items={breadcrumbItems} />
            <h1 className="text-3xl font-bold mt-2 mb-2" style={{ color: 'rgb(var(--fg-primary)) !important' }}>
              Create New Case
            </h1>
            <p className="text-lg" style={{ color: 'rgb(var(--fg-secondary)) !important' }}>
              Choose what you'd like to create. Your role ({userRole}) determines which options are available to you.
            </p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="modern-card text-center">
            <div className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center" style={{ background: 'rgb(var(--primary)) !important' }}>
              <i className="ri-apps-line text-white text-xl"></i>
            </div>
            <div className="text-2xl font-bold mb-1" style={{ color: 'rgb(var(--fg-primary)) !important' }}>{accessibleCaseTypes.length}</div>
            <div className="text-sm" style={{ color: 'rgb(var(--fg-secondary)) !important' }}>Available Options</div>
          </div>
          <div className="modern-card text-center">
            <div className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center" style={{ background: 'rgb(var(--accent-1)) !important' }}>
              <i className="ri-flask-line text-white text-xl"></i>
            </div>
            <div className="text-2xl font-bold mb-1" style={{ color: 'rgb(var(--fg-primary)) !important' }}>
              {accessibleCaseTypes.filter(ct => ct.category === 'Materials').length}
            </div>
            <div className="text-sm" style={{ color: 'rgb(var(--fg-secondary)) !important' }}>Materials</div>
          </div>
          <div className="modern-card text-center">
            <div className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center" style={{ background: 'rgb(var(--accent-2)) !important' }}>
              <i className="ri-test-tube-line text-white text-xl"></i>
            </div>
            <div className="text-2xl font-bold mb-1" style={{ color: 'rgb(var(--fg-primary)) !important' }}>
              {accessibleCaseTypes.filter(ct => ct.category === 'Formulations').length}
            </div>
            <div className="text-sm" style={{ color: 'rgb(var(--fg-secondary)) !important' }}>Formulations</div>
          </div>
          <div className="modern-card text-center">
            <div className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center" style={{ background: 'rgb(var(--warning)) !important' }}>
              <i className="ri-folder-line text-white text-xl"></i>
            </div>
            <div className="text-2xl font-bold mb-1" style={{ color: 'rgb(var(--fg-primary)) !important' }}>
              {accessibleCaseTypes.filter(ct => ct.category === 'Management').length}
            </div>
            <div className="text-sm" style={{ color: 'rgb(var(--fg-secondary)) !important' }}>Management</div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                selectedCategory === category
                  ? 'text-white'
                  : 'hover:bg-rgb(var(--bg-tertiary))'
              }`}
              style={{
                background: selectedCategory === category ? 'rgb(var(--primary)) !important' : 'rgb(var(--bg-secondary)) !important',
                color: selectedCategory === category ? 'white !important' : 'rgb(var(--fg-secondary)) !important',
                border: `1px solid ${selectedCategory === category ? 'rgb(var(--primary))' : 'rgb(var(--border-primary))'}`
              }}
            >
              <i className={`${getCategoryIcon(category)} mr-2 w-4 h-4`}></i>
              {category === 'all' ? 'All Categories' : category}
            </button>
          ))}
        </div>

        {/* Case Type Grid */}
        {filteredCaseTypes.length === 0 ? (
          <div className="text-center py-12">
            <i className="ri-lock-line text-4xl mb-4" style={{ color: 'rgb(var(--fg-quaternary)) !important' }}></i>
            <h3 className="text-lg font-medium mb-2" style={{ color: 'rgb(var(--fg-primary)) !important' }}>No Available Options</h3>
            <p style={{ color: 'rgb(var(--fg-secondary)) !important' }}>
              Your current role ({userRole}) doesn't have permission to create any cases in this category.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCaseTypes.map((caseType) => (
              <Link
                key={caseType.id}
                href={caseType.href}
                className="modern-card modern-card-interactive group"
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform" style={{ background: 'rgb(var(--primary) / 0.1) !important' }}>
                      <i className={`${caseType.icon} w-6 h-6`} style={{ color: 'rgb(var(--primary)) !important' }}></i>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold group-hover:text-primary transition-colors" style={{ color: 'rgb(var(--fg-primary)) !important' }}>
                      {caseType.name}
                    </h3>
                    <p className="text-sm mt-1 leading-relaxed" style={{ color: 'rgb(var(--fg-secondary)) !important' }}>
                      {caseType.description}
                    </p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="modern-badge badge-neutral">
                        {caseType.category}
                      </span>
                      <i className="ri-arrow-right-line group-hover:translate-x-1 transition-transform w-4 h-4" style={{ color: 'rgb(var(--fg-quaternary)) !important' }}></i>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Role Information */}
        <div className="modern-card p-6" style={{ background: 'rgb(var(--primary) / 0.05) !important', border: '1px solid rgb(var(--primary) / 0.2) !important' }}>
          <div className="flex items-start space-x-3">
            <i className="ri-information-line w-5 h-5 mt-0.5" style={{ color: 'rgb(var(--primary)) !important' }}></i>
            <div>
              <h4 className="text-sm font-medium mb-1" style={{ color: 'rgb(var(--primary)) !important' }}>Role-Based Access</h4>
              <p className="text-sm" style={{ color: 'rgb(var(--fg-secondary)) !important' }}>
                As a <strong>{userRole}</strong>, you can create {accessibleCaseTypes.length} out of {caseTypes.length} case types. 
                Contact your administrator if you need access to additional creation options.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
