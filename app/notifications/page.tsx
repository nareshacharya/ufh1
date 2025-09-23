
'use client';

import { useState } from 'react';
import { Breadcrumb } from '@/components/Breadcrumb';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  read: boolean;
  action?: {
    label: string;
    href: string;
  };
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Formula Compliance Check Completed',
    message: 'Your formula "Summer Breeze" has passed all compliance checks with a score of 98%.',
    type: 'success',
    timestamp: '2024-01-15T10:30:00Z',
    read: false,
    action: { label: 'View Report', href: '/compliance' }
  },
  {
    id: '2',
    title: 'Project Deadline Reminder',
    message: 'The "Luxury Spring Collection" project deadline is approaching in 5 days.',
    type: 'warning',
    timestamp: '2024-01-15T09:15:00Z',
    read: false,
    action: { label: 'View Project', href: '/projects' }
  },
  {
    id: '3',
    title: 'New Ingredient Added',
    message: 'Bulgarian Rose Absolute has been added to your ingredient database.',
    type: 'info',
    timestamp: '2024-01-14T16:45:00Z',
    read: true,
    action: { label: 'View Ingredient', href: '/ingredients' }
  },
  {
    id: '4',
    title: 'Low Stock Alert',
    message: 'Sandalwood Mysore is running low. Only 5 units remaining in inventory.',
    type: 'warning',
    timestamp: '2024-01-14T14:20:00Z',
    read: true,
    action: { label: 'Reorder', href: '/ingredients' }
  },
  {
    id: '5',
    title: 'Formula Shared',
    message: 'Sarah Johnson shared the formula "Ocean Mist" with you for review.',
    type: 'info',
    timestamp: '2024-01-13T11:00:00Z',
    read: true,
    action: { label: 'Review Formula', href: '/formulas' }
  }
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [filter, setFilter] = useState('all');

  const breadcrumbItems = [
    { label: 'Home', href: '/', icon: 'ri-home-line' },
    { label: 'Notifications', icon: 'ri-notification-line' }
  ];

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.read;
    if (filter === 'read') return notification.read;
    return true;
  });

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev =>
      prev.filter(notification => notification.id !== id)
    );
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return 'ri-check-line';
      case 'warning': return 'ri-alert-line';
      case 'error': return 'ri-error-warning-line';
      case 'info': return 'ri-information-line';
      default: return 'ri-notification-line';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success': return 'bg-accent-1';
      case 'warning': return 'bg-amber-500';
      case 'error': return 'bg-red-500';
      case 'info': return 'bg-primary';
      default: return 'bg-slate-500';
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = diff / (1000 * 60 * 60);
    
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${Math.floor(hours)}h ago`;
    return date.toLocaleDateString();
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="animate-fade-in">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <Breadcrumb items={breadcrumbItems} />
            <h1 className="text-3xl font-bold mt-2 mb-2" style={{ color: 'rgb(var(--fg-primary)) !important' }}>Notifications</h1>
            <p className="text-lg" style={{ color: 'rgb(var(--fg-secondary)) !important' }}>
              Stay updated with your latest activities and alerts
              {unreadCount > 0 && (
                <span className="ml-2 modern-badge badge-primary">
                  {unreadCount} unread
                </span>
              )}
            </p>
          </div>
          <div className="flex items-center gap-3 ml-6">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="btn-secondary whitespace-nowrap"
              >
                <i className="ri-check-double-line w-4 h-4 mr-2"></i>
                Mark All Read
              </button>
            )}
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="modern-card mb-6">
          <div className="flex space-x-1 p-1 rounded-lg" style={{ background: 'rgb(var(--shade-100)) !important' }}>
            {[
              { id: 'all', label: 'All', count: notifications.length },
              { id: 'unread', label: 'Unread', count: unreadCount },
              { id: 'read', label: 'Read', count: notifications.length - unreadCount }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  filter === tab.id
                    ? 'bg-white shadow-sm' 
                    : 'hover:bg-shade-200'
                }`}
                style={{
                  color: filter === tab.id ? 'rgb(var(--fg-primary)) !important' : 'rgb(var(--fg-secondary)) !important'
                }}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span className="ml-2 text-xs px-2 py-1 rounded-full" style={{ background: 'rgb(var(--shade-200)) !important' }}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {filteredNotifications.length === 0 ? (
            <div className="modern-card text-center py-12">
              <i className="ri-notification-off-line text-4xl mb-4" style={{ color: 'rgb(var(--fg-quaternary)) !important' }}></i>
              <h3 className="text-lg font-medium mb-2" style={{ color: 'rgb(var(--fg-primary)) !important' }}>
                No notifications
              </h3>
              <p style={{ color: 'rgb(var(--fg-secondary)) !important' }}>
                {filter === 'unread' ? "You're all caught up!" : 'No notifications to display.'}
              </p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`modern-card ${!notification.read ? 'ring-1 ring-primary' : ''}`}
                style={{
                  background: !notification.read ? 'rgb(var(--shade-50)) !important' : 'rgb(var(--bg-secondary)) !important'
                }}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 ${getNotificationColor(notification.type)} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <i className={`${getNotificationIcon(notification.type)} text-white w-5 h-5`}></i>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1" style={{ color: 'rgb(var(--fg-primary)) !important' }}>
                          {notification.title}
                          {!notification.read && (
                            <span className="inline-block w-2 h-2 rounded-full ml-2" style={{ background: 'rgb(var(--primary)) !important' }}></span>
                          )}
                        </h3>
                        <p className="text-sm mb-2" style={{ color: 'rgb(var(--fg-secondary)) !important' }}>
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-4">
                          <span className="text-xs" style={{ color: 'rgb(var(--fg-quaternary)) !important' }}>
                            {formatTime(notification.timestamp)}
                          </span>
                          {notification.action && (
                            <button className="text-primary text-xs font-medium hover:underline">
                              {notification.action.label}
                            </button>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="p-1 rounded transition-colors hover:text-primary"
                            style={{ color: 'rgb(var(--fg-quaternary)) !important' }}
                            title="Mark as read"
                          >
                            <i className="ri-check-line w-4 h-4"></i>
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="p-1 rounded transition-colors hover:text-red-500"
                          style={{ color: 'rgb(var(--fg-quaternary)) !important' }}
                          title="Delete notification"
                        >
                          <i className="ri-close-line w-4 h-4"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Summary */}
        {notifications.length > 0 && (
          <div className="modern-card" style={{ background: 'rgb(var(--shade-100)) !important' }}>
            <div className="flex items-center justify-between text-sm" style={{ color: 'rgb(var(--fg-secondary)) !important' }}>
              <span>
                Showing {filteredNotifications.length} of {notifications.length} notifications
              </span>
              <button className="text-primary hover:underline">
                Notification Settings
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
