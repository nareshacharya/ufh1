
'use client';

import { useState } from 'react';
import { Breadcrumb } from '@/components/Breadcrumb';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);

  const breadcrumbItems = [
    { label: 'Home', href: '/', icon: 'ri-home-line' },
    { label: 'Profile', icon: 'ri-user-line' }
  ];

  const user = {
    name: 'John Doe',
    email: 'john.doe@perfumery.com',
    role: 'Senior Perfumer',
    department: 'Fragrance Development',
    joinDate: '2022-03-15',
    location: 'New York, NY',
    phone: '+1 (555) 123-4567',
    bio: 'Passionate perfumer with over 10 years of experience in creating luxury fragrances. Specialized in floral and oriental compositions.',
    avatar: null
  };

  const stats = [
    { label: 'Formulas Created', value: 42, icon: 'ri-test-tube-line', color: 'bg-primary' },
    { label: 'Projects Completed', value: 18, icon: 'ri-folder-line', color: 'bg-accent-1' },
    { label: 'Ingredients Used', value: 156, icon: 'ri-flask-line', color: 'bg-accent-2' },
    { label: 'Years Experience', value: 10, icon: 'ri-time-line', color: 'bg-amber-500' }
  ];

  const recentActivity = [
    { id: 1, action: 'Created formula "Summer Breeze"', date: '2024-01-15', type: 'create' },
    { id: 2, action: 'Updated project "Luxury Spring Collection"', date: '2024-01-14', type: 'update' },
    { id: 3, action: 'Completed compliance check for "Ocean Mist"', date: '2024-01-13', type: 'complete' },
    { id: 4, action: 'Added new ingredient "Bulgarian Rose"', date: '2024-01-12', type: 'add' }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'create': return 'ri-add-circle-line';
      case 'update': return 'ri-edit-line';
      case 'complete': return 'ri-check-line';
      case 'add': return 'ri-flask-line';
      default: return 'ri-information-line';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="animate-fade-in">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <Breadcrumb items={breadcrumbItems} />
            <h1 className="text-3xl font-bold mt-2 mb-2" style={{ color: 'rgb(var(--fg-primary)) !important' }}>Profile</h1>
            <p className="text-lg" style={{ color: 'rgb(var(--fg-secondary)) !important' }}>
              Manage your account settings and preferences
            </p>
          </div>
          <div className="flex items-center gap-3 ml-6">
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className={isEditing ? 'btn-secondary' : 'btn-primary'}
            >
              <i className={`${isEditing ? 'ri-close-line' : 'ri-edit-line'} w-4 h-4 mr-2`}></i>
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>
        </div>

        {/* Profile Header */}
        <div className="modern-card mb-6">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full flex items-center justify-center text-white text-3xl font-bold" style={{ background: 'rgb(var(--primary)) !important' }}>
              {user.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold" style={{ color: 'rgb(var(--fg-primary)) !important' }}>{user.name}</h2>
              <p className="text-lg" style={{ color: 'rgb(var(--fg-secondary)) !important' }}>{user.role}</p>
              <p style={{ color: 'rgb(var(--fg-tertiary)) !important' }}>{user.department}</p>
              <div className="flex items-center gap-4 mt-2 text-sm" style={{ color: 'rgb(var(--fg-quaternary)) !important' }}>
                <span className="flex items-center gap-1">
                  <i className="ri-calendar-line w-4 h-4"></i>
                  Joined {new Date(user.joinDate).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-1">
                  <i className="ri-map-pin-line w-4 h-4"></i>
                  {user.location}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          {stats.map((stat, index) => (
            <div key={index} className="modern-card text-center">
              <div className={`w-12 h-12 ${stat.color} rounded-lg mx-auto mb-3 flex items-center justify-center`}>
                <i className={`${stat.icon} text-white w-6 h-6`}></i>
              </div>
              <div className="text-2xl font-bold" style={{ color: 'rgb(var(--fg-primary)) !important' }}>{stat.value}</div>
              <div className="text-sm" style={{ color: 'rgb(var(--fg-secondary)) !important' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="modern-card">
          <div className="border-b mb-6" style={{ borderColor: 'rgb(var(--shade-200)) !important' }}>
            <div className="flex space-x-8">
              {[
                { id: 'personal', label: 'Personal Info', icon: 'ri-user-line' },
                { id: 'security', label: 'Security', icon: 'ri-shield-line' },
                { id: 'preferences', label: 'Preferences', icon: 'ri-settings-line' },
                { id: 'activity', label: 'Activity', icon: 'ri-history-line' }
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
          {activeTab === 'personal' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'rgb(var(--fg-secondary)) !important' }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    defaultValue={user.name}
                    disabled={!isEditing}
                    className="modern-input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'rgb(var(--fg-secondary)) !important' }}>
                    Email
                  </label>
                  <input
                    type="email"
                    defaultValue={user.email}
                    disabled={!isEditing}
                    className="modern-input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'rgb(var(--fg-secondary)) !important' }}>
                    Phone
                  </label>
                  <input
                    type="tel"
                    defaultValue={user.phone}
                    disabled={!isEditing}
                    className="modern-input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'rgb(var(--fg-secondary)) !important' }}>
                    Location
                  </label>
                  <input
                    type="text"
                    defaultValue={user.location}
                    disabled={!isEditing}
                    className="modern-input"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'rgb(var(--fg-secondary)) !important' }}>
                  Bio
                </label>
                <textarea
                  rows={4}
                  defaultValue={user.bio}
                  disabled={!isEditing}
                  className="modern-input"
                />
              </div>
              {isEditing && (
                <div className="flex gap-3">
                  <button className="btn-primary">Save Changes</button>
                  <button className="btn-secondary">Reset</button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4" style={{ color: 'rgb(var(--fg-primary)) !important' }}>Change Password</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'rgb(var(--fg-secondary)) !important' }}>
                      Current Password
                    </label>
                    <input
                      type="password"
                      className="modern-input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'rgb(var(--fg-secondary)) !important' }}>
                      New Password
                    </label>
                    <input
                      type="password"
                      className="modern-input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'rgb(var(--fg-secondary)) !important' }}>
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      className="modern-input"
                    />
                  </div>
                  <button className="btn-primary">Update Password</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'preferences' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4" style={{ color: 'rgb(var(--fg-primary)) !important' }}>Notifications</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium" style={{ color: 'rgb(var(--fg-primary)) !important' }}>Email Notifications</p>
                      <p className="text-sm" style={{ color: 'rgb(var(--fg-tertiary)) !important' }}>Receive email updates about your projects</p>
                    </div>
                    <div className="toggle-switch active"></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium" style={{ color: 'rgb(var(--fg-primary)) !important' }}>Push Notifications</p>
                      <p className="text-sm" style={{ color: 'rgb(var(--fg-tertiary)) !important' }}>Get notified about important updates</p>
                    </div>
                    <div className="toggle-switch"></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold" style={{ color: 'rgb(var(--fg-primary)) !important' }}>Recent Activity</h3>
              <div className="space-y-3">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="activity-item">
                    <div className="activity-icon">
                      <i className={`${getActivityIcon(activity.type)} w-4 h-4 text-white`}></i>
                    </div>
                    <div className="flex-1">
                      <p style={{ color: 'rgb(var(--fg-primary)) !important' }} className="font-medium">{activity.action}</p>
                      <p className="text-sm" style={{ color: 'rgb(var(--fg-quaternary)) !important' }}>
                        {new Date(activity.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
