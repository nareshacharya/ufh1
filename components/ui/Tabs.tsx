
'use client';

import React, { useState } from 'react';

interface Tab {
  id: string;
  label: string;
  icon?: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  className?: string;
}

export function Tabs({ tabs, defaultTab, className = '' }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const activeTabContent = tabs.find(tab => tab.id === activeTab)?.content;

  return (
    <div className={`w-full ${className}`}>
      {/* Tab Navigation */}
      <div className="flex border-b-2 border-rgb(var(--shade-200)) mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all duration-200 border-b-2 -mb-0.5 whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-rgb(var(--primary)) text-rgb(var(--primary)) bg-rgb(var(--primary))/5'
                : 'border-transparent text-rgb(var(--fg-tertiary)) hover:text-rgb(var(--fg-secondary)) hover:border-rgb(var(--shade-300))'
            }`}
          >
            {tab.icon && (
              <i className={`${tab.icon} w-4 h-4 flex items-center justify-center`}></i>
            )}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTabContent}
      </div>
    </div>
  );
}