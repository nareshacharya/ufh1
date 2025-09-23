
'use client';

import React from 'react';

interface SkipLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

function SkipLink({ href, children, className = '' }: SkipLinkProps) {
  return (
    <a
      href={href}
      className={`
        sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 
        bg-rgb(var(--brand-primary)) text-white px-4 py-2 rounded-md 
        text-sm font-medium z-50 focus:outline-none focus:ring-2 
        focus:ring-rgb(var(--brand-primary)) focus:ring-offset-2
        ${className}
      `}
      data-testid={`skip-${href.replace('#', '')}`}
    >
      {children}
    </a>
  );
}

export function SkipLinks() {
  return (
    <>
      <SkipLink href="#main-content" data-testid="skip-to-content">
        Skip to main content
      </SkipLink>
      <SkipLink href="#sidebar-nav" data-testid="skip-to-navigation">
        Skip to navigation
      </SkipLink>
      <SkipLink href="#case-actions" data-testid="skip-to-actions">
        Skip to actions
      </SkipLink>
    </>
  );
}
