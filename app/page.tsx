
'use client';

import React from 'react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../hooks/useAuth';
import { getCurrentUserRole } from '../lib/auth/session';
import { Role } from '../lib/auth/rbac';
import { PerformanceDashboard } from '@/components/PerformanceDashboard';

interface StatItem {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: string;
  color: string;
}

interface ActivityItem {
  id: string;
  type: 'formula' | 'ingredient' | 'project' | 'compliance';
  title: string;
  subtitle: string;
  time: string;
  icon: string;
  color: string;
}

interface QuickAction {
  id: string;
  label: string;
  href: string;
  icon: string;
  roles: Role[];
}

const quickActions: QuickAction[] = [
  {
    id: 'browse-ingredients',
    label: 'Browse Ingredients',
    href: '/ingredients',
    icon: 'ri-flask-line',
    roles: ['Perfumer', 'PaletteManager', 'Admin']
  },
  {
    id: 'view-projects',
    label: 'View Projects',
    href: '/projects',
    icon: 'ri-folder-line',
    roles: ['ProjectManager', 'Admin']
  },
  {
    id: 'formula-library',
    label: 'Formula Library',
    href: '/formulas',
    icon: 'ri-file-list-3-line',
    roles: ['Perfumer', 'Admin']
  },
  {
    id: 'compliance-check',
    label: 'Compliance Check',
    href: '/compliance',
    icon: 'ri-shield-check-line',
    roles: ['ComplianceOfficer', 'Admin']
  }
];

const stats: StatItem[] = [
  {
    label: 'Active Formulas',
    value: '42',
    change: '+12%',
    trend: 'up',
    icon: 'ri-test-tube-line',
    color: 'text-primary'
  },
  {
    label: 'Total Ingredients',
    value: '1,247',
    change: '+8%',
    trend: 'up',
    icon: 'ri-flask-line',
    color: 'text-accent-1'
  },
  {
    label: 'Compliance Rate',
    value: '98.5%',
    change: '+2.1%',
    trend: 'up',
    icon: 'ri-shield-check-line',
    color: 'text-success'
  },
  {
    label: 'Active Projects',
    value: '18',
    change: '+3',
    trend: 'up',
    icon: 'ri-folder-line',
    color: 'text-accent-button'
  }
];

const recentActivity: ActivityItem[] = [
  {
    id: '1',
    type: 'formula',
    title: 'Formula "Summer Breeze" created',
    subtitle: '2 hours ago',
    time: '14:30',
    icon: 'ri-test-tube-fill',
    color: 'bg-primary'
  },
  {
    id: '2',
    type: 'ingredient',
    title: 'Bergamot Oil added',
    subtitle: '4 hours ago',
    time: '12:15',
    icon: 'ri-flask-fill',
    color: 'bg-accent-1'
  },
  {
    id: '3',
    type: 'project',
    title: 'Project "Ocean Mist" updated',
    subtitle: '6 hours ago',
    time: '10:45',
    icon: 'ri-folder-fill',
    color: 'bg-accent-button'
  },
  {
    id: '4',
    type: 'compliance',
    title: 'Compliance check completed',
    subtitle: '8 hours ago',
    time: '08:20',
    icon: 'ri-shield-check-fill',
    color: 'bg-success'
  },
  {
    id: '5',
    type: 'formula',
    title: 'Formula "Midnight Garden" approved',
    subtitle: '1 day ago',
    time: 'Yesterday',
    icon: 'ri-checkbox-circle-fill',
    color: 'bg-success'
  }
];

const topIngredients = [
  { name: 'Bergamot Oil', usage: 85, change: '+5%' },
  { name: 'Vanilla Extract', usage: 78, change: '+12%' },
  { name: 'Rose Absolute', usage: 72, change: '-2%' },
  { name: 'Sandalwood', usage: 68, change: '+8%' },
  { name: 'Lavender Oil', usage: 64, change: '+3%' }
];

export default function HomePage() {
  const { user, loading } = useAuth();
  const [userRole, setUserRole] = useState<Role | null>(null);
  const [currentTime, setCurrentTime] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    let rolePromise: Promise<Role | null> | null = null;
    
    if (user) {
      rolePromise = getCurrentUserRole();
      rolePromise
        .then(role => {
          setUserRole(role);
        })
        .catch(console.error);
    }

    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => {
      clearInterval(interval);
    };
  }, [user, mounted]);

  const getAccessibleQuickActions = () => {
    if (!userRole) return [];
    return quickActions.filter(action => action.roles.includes(userRole));
  };

  if (!mounted || loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-shade-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-shade-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-shade-200 rounded w-1/4"></div>
        </div>
      </div>
    );
  }

  const accessibleActions = getAccessibleQuickActions();

  return (
    <div className="min-h-screen bg-rgb-bg-primary theme-transition">
      <main className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-rgb-fg-primary">
            Welcome, {user?.name || 'User'}!
          </h1>
        </div>

        {/* Quick Stats Overview - Single Row */}
        <div className="grid grid-cols-4 gap-6 mb-6">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-rgb-fg-primary">{stat.value}</p>
                  <p className="text-sm text-rgb-fg-secondary">{stat.label}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <i className={`ri-arrow-${stat.trend === 'up' ? 'up' : 'down'}-line text-xs ${
                      stat.trend === 'up' ? 'text-success' : 'text-error'
                    }`}></i>
                    <span className={`text-xs font-medium ${
                      stat.trend === 'up' ? 'text-success' : 'text-error'
                    }`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div className={`stat-icon ${stat.color}`}>
                  <i className={`${stat.icon} text-lg`}></i>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Dashboard Grid - Bento Box Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
          {/* Quick Actions - Enhanced Bento Card */}
          <div className="lg:col-span-6">
            <div className="accent-card-green h-full">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-6 h-6 flex items-center justify-center">
                  <i className="ri-flashlight-line text-lg text-white"></i>
                </div>
                <h2 className="text-lg font-semibold text-white">Quick Actions</h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {accessibleActions.map((action) => (
                  <Link key={action.id} href={action.href} className="action-card-light group">
                    <div className="action-icon mb-3 group-hover:scale-110 transition-transform">
                      <i className={`${action.icon} text-xl text-white`}></i>
                    </div>
                    <span className="text-sm font-medium text-white text-center">{action.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Performance Dashboard - Enhanced */}
          <div className="lg:col-span-6">
            <PerformanceDashboard />
          </div>
        </div>

        {/* Bottom Row - Recent Activity & Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <div className="modern-card">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-6 h-6 flex items-center justify-center">
                <i className="ri-time-line text-lg text-primary"></i>
              </div>
              <h2 className="text-lg font-semibold text-rgb-fg-primary">Recent Activity</h2>
            </div>
            <div className="space-y-3">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="activity-item">
                  <div className={`activity-icon ${activity.color} text-white`}>
                    <i className={`${activity.icon} text-sm`}></i>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-rgb-fg-primary">{activity.title}</p>
                    <p className="text-xs text-rgb-fg-tertiary">{activity.subtitle}</p>
                  </div>
                  <div className="text-xs text-rgb-fg-quaternary">{activity.time}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Formula Insights & Top Ingredients */}
          <div className="space-y-6">
            {/* Formula Trend Chart */}
            <div className="modern-card">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 flex items-center justify-center">
                  <i className="ri-pulse-line text-lg text-primary"></i>
                </div>
                <h2 className="text-lg font-semibold text-rgb-fg-primary">Formula Trend</h2>
              </div>
              <div className="h-24 flex items-center justify-center">
                <div className="flex items-end gap-2 h-16">
                  {[65, 80, 45, 90, 75, 85, 70].map((height, index) => (
                    <div
                      key={index}
                      className="w-4 bg-gradient-to-t from-primary to-primary-light rounded-t transition-all duration-500 hover:scale-110"
                      style={{ height: `${height}%` }}
                    ></div>
                  ))}
                </div>
              </div>
            </div>

            {/* Top Ingredients */}
            <div className="accent-card-green">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 flex items-center justify-center">
                  <i className="ri-star-line text-lg text-white"></i>
                </div>
                <h2 className="text-lg font-semibold text-white">Most Used Ingredients</h2>
              </div>
              <div className="space-y-3">
                {topIngredients.slice(0, 4).map((ingredient, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex-1 mr-3">
                      <p className="text-sm font-medium text-white mb-1">{ingredient.name}</p>
                      <div className="w-full bg-white/20 rounded-full h-2">
                        <div
                          className="bg-white h-2 rounded-full transition-all duration-500"
                          style={{ width: `${ingredient.usage}%` }}
                        ></div>
                      </div>
                    </div>
                    <span className="text-xs font-medium text-white/80">{ingredient.change}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
