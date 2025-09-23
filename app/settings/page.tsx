
'use client';

import { useState } from 'react';
import { useTheme } from '@/components/ThemeProvider';
import { Breadcrumb } from '@/components/Breadcrumb';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const { theme, setTheme, resolvedTheme } = useTheme();

  const breadcrumbItems = [
    { label: 'Home', href: '/', icon: 'ri-home-line' },
    { label: 'Settings', icon: 'ri-settings-line' }
  ];

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="animate-fade-in">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <Breadcrumb items={breadcrumbItems} />
            <h1 className="text-3xl font-bold mt-2 mb-2" style={{ color: 'rgb(var(--fg-primary)) !important' }}>Settings</h1>
            <p className="text-lg" style={{ color: 'rgb(var(--fg-secondary)) !important' }}>
              Configure your application preferences and system settings
            </p>
          </div>
        </div>

        {/* Settings Content */}
        <div className="modern-card">
          <div className="border-b mb-6" style={{ borderColor: 'rgb(var(--shade-200)) !important' }}>
            <div className="flex space-x-8">
              {[
                { id: 'general', label: 'General', icon: 'ri-settings-line' },
                { id: 'appearance', label: 'Appearance', icon: 'ri-palette-line' },
                { id: 'notifications', label: 'Notifications', icon: 'ri-notification-line' },
                { id: 'system', label: 'System', icon: 'ri-computer-line' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`profile-tab ${activeTab === tab.id ? 'active' : ''}`}
                >
                  <i className={`${tab.icon} w-4 h-4 mr-2`}></i>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4" style={{ color: 'rgb(var(--fg-primary)) !important' }}>General Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'rgb(var(--fg-secondary)) !important' }}>
                      Default Language
                    </label>
                    <select className="modern-input pr-8">
                      <option value="en">English</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                      <option value="es">Spanish</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'rgb(var(--fg-secondary)) !important' }}>
                      Time Zone
                    </label>
                    <select className="modern-input pr-8">
                      <option value="UTC">UTC</option>
                      <option value="EST">Eastern Time</option>
                      <option value="PST">Pacific Time</option>
                      <option value="CET">Central European Time</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'rgb(var(--fg-secondary)) !important' }}>
                      Date Format
                    </label>
                    <select className="modern-input pr-8">
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4" style={{ color: 'rgb(var(--fg-primary)) !important' }}>Appearance Settings</h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-3" style={{ color: 'rgb(var(--fg-secondary)) !important' }}>
                      Theme
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="relative">
                        <input 
                          type="radio" 
                          id="light" 
                          name="theme" 
                          value="light" 
                          className="sr-only peer" 
                          checked={theme === 'light'}
                          onChange={() => handleThemeChange('light')}
                        />
                        <label htmlFor="light" className="flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer peer-checked:border-primary peer-checked:bg-blue-50 dark:peer-checked:bg-blue-900/20 hover:bg-shade-100 transition-colors" style={{ borderColor: 'rgb(var(--shade-200)) !important' }}>
                          <i className="ri-sun-line w-6 h-6 mb-2 text-amber-500"></i>
                          <span className="text-sm font-medium">Light</span>
                        </label>
                      </div>
                      <div className="relative">
                        <input 
                          type="radio" 
                          id="dark" 
                          name="theme" 
                          value="dark" 
                          className="sr-only peer" 
                          checked={theme === 'dark'}
                          onChange={() => handleThemeChange('dark')}
                        />
                        <label htmlFor="dark" className="flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer peer-checked:border-primary peer-checked:bg-blue-50 dark:peer-checked:bg-blue-900/20 hover:bg-shade-100 transition-colors" style={{ borderColor: 'rgb(var(--shade-200)) !important' }}>
                          <i className="ri-moon-line w-6 h-6 mb-2 text-indigo-500"></i>
                          <span className="text-sm font-medium">Dark</span>
                        </label>
                      </div>
                      <div className="relative">
                        <input 
                          type="radio" 
                          id="system" 
                          name="theme" 
                          value="system" 
                          className="sr-only peer" 
                          checked={theme === 'system'}
                          onChange={() => handleThemeChange('system')}
                        />
                        <label htmlFor="system" className="flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer peer-checked:border-primary peer-checked:bg-blue-50 dark:peer-checked:bg-blue-900/20 hover:bg-shade-100 transition-colors" style={{ borderColor: 'rgb(var(--shade-200)) !important' }}>
                          <i className="ri-computer-line w-6 h-6 mb-2" style={{ color: 'rgb(var(--fg-quaternary)) !important' }}></i>
                          <span className="text-sm font-medium">System</span>
                        </label>
                      </div>
                    </div>
                    <div className="mt-3 p-3 rounded-lg" style={{ background: 'rgb(var(--shade-100)) !important' }}>
                      <div className="flex items-center gap-2 text-sm" style={{ color: 'rgb(var(--fg-secondary)) !important' }}>
                        <i className="ri-information-line w-4 h-4"></i>
                        <span>Current theme: <strong style={{ color: 'rgb(var(--fg-primary)) !important' }}>{theme}</strong> (displaying as <strong style={{ color: 'rgb(var(--fg-primary)) !important' }}>{resolvedTheme}</strong>)</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium" style={{ color: 'rgb(var(--fg-primary)) !important' }}>Compact Mode</p>
                      <p className="text-sm" style={{ color: 'rgb(var(--fg-tertiary)) !important' }}>Reduce spacing and element sizes</p>
                    </div>
                    <div className="toggle-switch"></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium" style={{ color: 'rgb(var(--fg-primary)) !important' }}>High Contrast</p>
                      <p className="text-sm" style={{ color: 'rgb(var(--fg-terciary)) !important' }}>Increase contrast for better accessibility</p>
                    </div>
                    <div className="toggle-switch"></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4" style={{ color: 'rgb(var(--fg-primary)) !important' }}>Notification Preferences</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium" style={{ color: 'rgb(var(--fg-primary)) !important' }}>Formula Updates</p>
                      <p className="text-sm" style={{ color: 'rgb(var(--fg-tertiary)) !important' }}>Get notified when formulas are updated</p>
                    </div>
                    <div className="toggle-switch active"></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium" style={{ color: 'rgb(var(--fg-primary)) !important' }}>Project Deadlines</p>
                      <p className="text-sm" style={{ color: 'rgb(var(--fg-tertiary)) !important' }}>Reminders for upcoming project deadlines</p>
                    </div>
                    <div className="toggle-switch active"></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium" style={{ color: 'rgb(var(--fg-primary)) !important' }}>Compliance Alerts</p>
                      <p className="text-sm" style={{ color: 'rgb(var(--fg-tertiary)) !important' }}>Important compliance and safety notifications</p>
                    </div>
                    <div className="toggle-switch active"></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium" style={{ color: 'rgb(var(--fg-primary)) !important' }}>Team Mentions</p>
                      <p className="text-sm" style={{ color: 'rgb(var(--fg-tertiary)) !important' }}>When someone mentions you in comments</p>
                    </div>
                    <div className="toggle-switch"></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'system' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4" style={{ color: 'rgb(var(--fg-primary)) !important' }}>System Information</h3>
                <div className="p-4 rounded-lg space-y-3" style={{ background: 'rgb(var(--shade-100)) !important' }}>
                  <div className="flex justify-between items-center">
                    <span style={{ color: 'rgb(var(--fg-secondary)) !important' }}>Version</span>
                    <span className="font-medium" style={{ color: 'rgb(var(--fg-primary)) !important' }}>v2.1.0</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span style={{ color: 'rgb(var(--fg-secondary)) !important' }}>Last Updated</span>
                    <span className="font-medium" style={{ color: 'rgb(var(--fg-primary)) !important' }}>January 15, 2024</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span style={{ color: 'rgb(var(--fg-secondary)) !important' }}>Database Status</span>
                    <span className="modern-badge badge-success">Connected</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span style={{ color: 'rgb(var(--fg-secondary)) !important' }}>Storage Used</span>
                    <span className="font-medium" style={{ color: 'rgb(var(--fg-primary)) !important' }}>2.4 GB / 10 GB</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span style={{ color: 'rgb(var(--fg-secondary)) !important' }}>Theme Engine</span>
                    <span className="modern-badge badge-primary">Active</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4" style={{ color: 'rgb(var(--fg-primary)) !important' }}>System Actions</h3>
                <div className="space-y-3">
                  <button className="btn-secondary w-full justify-center">
                    <i className="ri-refresh-line w-4 h-4 mr-2"></i>
                    Clear Cache
                  </button>
                  <button className="btn-secondary w-full justify-center">
                    <i className="ri-download-line w-4 h-4 mr-2"></i>
                    Export Data
                  </button>
                  <button className="btn-secondary w-full justify-center">
                    <i className="ri-upload-line w-4 h-4 mr-2"></i>
                    Import Data
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="pt-6 border-t" style={{ borderColor: 'rgb(var(--shade-200)) !important' }}>
            <div className="flex gap-3">
              <button className="btn-primary">Save Changes</button>
              <button className="btn-secondary">Reset to Default</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
