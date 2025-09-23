'use client';

import Link from 'next/link';

interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  if (!items.length) return null;

  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex items-center space-x-2 text-sm">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <i className="ri-arrow-right-s-line text-rgb(var(--fg-quaternary)) mx-2 w-4 h-4 flex items-center justify-center"></i>
            )}
            {item.href ? (
              <Link
                href={item.href}
                className="flex items-center gap-1 text-rgb(var(--fg-tertiary)) hover:text-rgb(var(--primary)) transition-colors"
              >
                {item.icon && (
                  <i className={`${item.icon} w-4 h-4 flex items-center justify-center`}></i>
                )}
                {item.label}
              </Link>
            ) : (
              <span className="flex items-center gap-1 text-rgb(var(--fg-primary)) font-medium">
                {item.icon && (
                  <i className={`${item.icon} w-4 h-4 flex items-center justify-center`}></i>
                )}
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}