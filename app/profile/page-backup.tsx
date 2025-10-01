"use client";

import { useState, useRef, useEffect } from "react";
import { Breadcrumb } from "@/components/Breadcrumb";
import { UserAvatarWithFallback } from "@/components/UserAvatar";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("personal");
  const [isEditing, setIsEditing] = useState(false);
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);
  const [selectedAvatarSeed, setSelectedAvatarSeed] = useState(
    "john.smith@foodinnovation.com"
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load saved avatar from localStorage on component mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedSeed = localStorage.getItem("userAvatarSeed");
      if (savedSeed) {
        setSelectedAvatarSeed(savedSeed);
      }
    }
  }, []);

  const breadcrumbItems = [
    { label: "Home", href: "/", icon: "ri-home-line" },
    { label: "Profile", icon: "ri-user-line" },
  ];

  const user = {
    name: "John Smith",
    email: "john.smith@foodinnovation.com",
    role: "Senior Product Manager",
    department: "R&D Food Innovation",
    joinDate: "2022-03-15",
    location: "New York, USA",
    phone: "+1 (555) 123-4567",
    bio: "Passionate product manager with over 8 years of experience in food innovation and sustainable development. Leading cross-functional teams to deliver exceptional product experiences that delight customers and drive business growth.",
    avatar: null,
    badges: ["Team Lead", "Innovation Expert", "Sustainability Champion"],
    socialLinks: {
      linkedin: "john-smith",
      twitter: "@johnsmith_food",
    },
  };

  const stats = [
    {
      label: "Cases Created",
      value: 24,
      icon: "ri-file-text-line",
      color: "bg-emerald-500",
      change: "+12%",
      trend: "up",
    },
    {
      label: "Formulas Developed",
      value: 12,
      icon: "ri-test-tube-line",
      color: "bg-blue-500",
      change: "+5%",
      trend: "up",
    },
    {
      label: "Projects Active",
      value: 8,
      icon: "ri-folder-line",
      color: "bg-purple-500",
      change: "0%",
      trend: "neutral",
    },
    {
      label: "Team Members",
      value: 15,
      icon: "ri-team-line",
      color: "bg-orange-500",
      change: "+3",
      trend: "up",
    },
  ];

  const avatarOptions = [
    "john.smith@foodinnovation.com",
    "avatar1",
    "avatar2",
    "avatar3",
    "professional",
    "creative",
    "technical",
    "manager",
  ];

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Handle file upload - in real app, upload to server
      console.log("File selected:", file.name);
      // TODO: Upload to backend and update user.avatar
    }
  };

  const handleAvatarSelect = (seed: string) => {
    setSelectedAvatarSeed(seed);
    setShowAvatarSelector(false);
    // Save to localStorage to sync with navigation
    if (typeof window !== "undefined") {
      localStorage.setItem("userAvatarSeed", seed);
      // Trigger a custom event to notify other components
      window.dispatchEvent(
        new CustomEvent("avatarChanged", { detail: { seed } })
      );
    }
    // TODO: Save to backend
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${user.name} - ${user.role}`,
          text: user.bio,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      // Fallback: copy URL to clipboard
      navigator.clipboard.writeText(window.location.href);
      // Show toast notification (you could implement this)
      console.log("Profile URL copied to clipboard");
    }
  };

  const recentActivity = [
    {
      id: 1,
      action: 'Created formula "Summer Breeze"',
      date: "2024-01-15",
      type: "create",
    },
    {
      id: 2,
      action: 'Updated project "Luxury Spring Collection"',
      date: "2024-01-14",
      type: "update",
    },
    {
      id: 3,
      action: 'Completed compliance check for "Ocean Mist"',
      date: "2024-01-13",
      type: "complete",
    },
    {
      id: 4,
      action: 'Added new ingredient "Bulgarian Rose"',
      date: "2024-01-12",
      type: "add",
    },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "create":
        return "ri-add-circle-line";
      case "update":
        return "ri-edit-line";
      case "complete":
        return "ri-check-line";
      case "add":
        return "ri-flask-line";
      default:
        return "ri-information-line";
    }
  };

  return (
    <div className="p-4 lg:p-6 w-full min-h-screen">
      <div className="animate-fade-in h-full">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <Breadcrumb items={breadcrumbItems} />
            <h1
              className="text-3xl font-bold mt-2 mb-2"
              style={{ color: "rgb(var(--fg-primary)) !important" }}
            >
              Profile
            </h1>
            <p
              className="text-lg"
              style={{ color: "rgb(var(--fg-secondary)) !important" }}
            >
              Manage your account settings and preferences
            </p>
          </div>
          <div className="flex items-center gap-3 ml-6">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={isEditing ? "btn-secondary" : "btn-primary"}
            >
              <i
                className={`${
                  isEditing ? "ri-close-line" : "ri-edit-line"
                } w-4 h-4 mr-2`}
              ></i>
              {isEditing ? "Cancel" : "Edit Profile"}
            </button>
          </div>
        </div>

        {/* Main Content - Side by Side Layout */}
        <div className="flex flex-col xl:flex-row gap-8 mb-8">
          {/* Left Section - Profile Card (70%) */}
          <div className="w-full xl:w-7/10 flex-shrink-0">
            <div className="profile-card-redesigned modern-card relative overflow-hidden">
              {/* Header Actions */}
              <div className="absolute top-4 right-4 flex gap-2 z-10">
                <button
                  onClick={handleShare}
                  className="w-10 h-10 rounded-full bg-opacity-10 backdrop-blur-sm border border-opacity-20 flex items-center justify-center hover:bg-opacity-20 transition-all"
                  style={{
                    backgroundColor: "rgba(var(--primary), 0.1)",
                    borderColor: "rgba(var(--primary), 0.2)",
                    color: "rgb(var(--fg-primary))",
                  }}
                  title="Share Profile"
                >
                  <i className="ri-share-line w-4 h-4"></i>
                </button>
              </div>

              <div className="p-8">
                {/* Top Section - Avatar and Basic Info */}
                <div className="flex flex-col items-center text-center mb-8">
                  {/* Large Avatar Section */}
                  <div className="relative mb-6">
                    <div className="relative group">
                      <div className="w-40 h-40 rounded-full overflow-hidden cursor-pointer ring-4 ring-primary/20 transition-all group-hover:ring-primary/40 shadow-xl">
                        <UserAvatarWithFallback
                          userId={selectedAvatarSeed}
                          userName={user.name}
                          userEmail={user.email}
                          profileImage={user.avatar || undefined}
                          size={160}
                          className="w-full h-full"
                        />
                      </div>
                      {/* Avatar Edit Buttons */}
                      <div className="absolute -bottom-2 -right-2 flex gap-2">
                        <button
                          onClick={() => setShowAvatarSelector(true)}
                          className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shadow-lg hover:scale-110 transition-all"
                          title="Choose Avatar"
                        >
                          <i className="ri-user-line w-4 h-4"></i>
                        </button>
                        <button
                          onClick={handleAvatarClick}
                          className="w-10 h-10 rounded-full bg-accent-1 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-all"
                          title="Upload Image"
                        >
                          <i className="ri-camera-line w-4 h-4"></i>
                        </button>
                      </div>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>

                  {/* Basic Info */}
                  <div className="mb-6">
                    <h1
                      className="text-4xl font-bold mb-3"
                      style={{ color: "rgb(var(--fg-primary))" }}
                    >
                      {user.name}
                    </h1>
                    <p
                      className="text-xl mb-2"
                      style={{ color: "rgb(var(--fg-secondary))" }}
                    >
                      {user.role}
                    </p>
                    <p
                      className="text-lg"
                      style={{ color: "rgb(var(--fg-tertiary))" }}
                    >
                      {user.department}
                    </p>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-3 mb-8 justify-center">
                    {user.badges.map((badge, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 text-sm rounded-full backdrop-blur-sm border transition-all hover:scale-105 shadow-md"
                        style={{
                          backgroundColor: "rgba(var(--primary), 0.1)",
                          borderColor: "rgba(var(--primary), 0.2)",
                          color: "rgb(var(--fg-primary))",
                        }}
                      >
                        {badge}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bio and Contact Info */}
                <div className="text-center">
                  <p
                    className="leading-relaxed mb-6 max-w-2xl mx-auto"
                    style={{ color: "rgb(var(--fg-secondary))" }}
                  >
                    {user.bio}
                  </p>

                  {/* Contact & Social Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mb-6 max-w-lg mx-auto">
                    <div
                      className="flex items-center gap-3 justify-center"
                      style={{ color: "rgb(var(--fg-tertiary))" }}
                    >
                      <i className="ri-mail-line w-4 h-4 flex items-center justify-center"></i>
                      <span>{user.email}</span>
                    </div>
                    <div
                      className="flex items-center gap-3 justify-center"
                      style={{ color: "rgb(var(--fg-tertiary))" }}
                    >
                      <i className="ri-phone-line w-4 h-4 flex items-center justify-center"></i>
                      <span>{user.phone}</span>
                    </div>
                    <div
                      className="flex items-center gap-3 justify-center"
                      style={{ color: "rgb(var(--fg-tertiary))" }}
                    >
                      <i className="ri-map-pin-line w-4 h-4 flex items-center justify-center"></i>
                      <span>{user.location}</span>
                    </div>
                    <div
                      className="flex items-center gap-3 justify-center"
                      style={{ color: "rgb(var(--fg-tertiary))" }}
                    >
                      <i className="ri-calendar-line w-4 h-4 flex items-center justify-center"></i>
                      <span>
                        Joined {new Date(user.joinDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Social Links */}
                  <div className="flex gap-4 justify-center">
                    <a
                      href={`https://linkedin.com/in/${user.socialLinks.linkedin}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
                      style={{
                        backgroundColor: "rgba(var(--primary), 0.1)",
                        borderColor: "rgba(var(--primary), 0.2)",
                        color: "rgb(var(--fg-primary))",
                        border: "1px solid",
                      }}
                    >
                      <i className="ri-linkedin-line w-5 h-5"></i>
                    </a>
                    <a
                      href={`https://x.com/${user.socialLinks.twitter.replace(
                        "@",
                        ""
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
                      style={{
                        backgroundColor: "rgba(var(--primary), 0.1)",
                        borderColor: "rgba(var(--primary), 0.2)",
                        color: "rgb(var(--fg-primary))",
                        border: "1px solid",
                      }}
                    >
                      <i className="ri-twitter-x-line w-4 h-4"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - Stats (30%) */}
          <div className="w-full xl:w-3/10 flex-shrink-0">
            <div className="space-y-4">
              <h2
                className="text-xl font-bold mb-4"
                style={{ color: "rgb(var(--fg-primary))" }}
              >
                Performance
              </h2>
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="stat-card-redesigned modern-card hover:shadow-lg transition-all duration-300 group p-4"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-14 h-14 ${stat.color} rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform shadow-lg`}
                    >
                      <i className={`${stat.icon} text-white w-7 h-7`}></i>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div
                          className="text-2xl font-bold"
                          style={{ color: "rgb(var(--fg-primary))" }}
                        >
                          {stat.value}
                        </div>
                        <div
                          className={`text-xs font-medium px-2 py-1 rounded-full ${
                            stat.trend === "up"
                              ? "bg-green-100 text-green-700"
                              : stat.trend === "down"
                              ? "bg-red-100 text-red-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {stat.trend === "up" && (
                            <i className="ri-arrow-up-line w-3 h-3 inline mr-1"></i>
                          )}
                          {stat.trend === "down" && (
                            <i className="ri-arrow-down-line w-3 h-3 inline mr-1"></i>
                          )}
                          {stat.trend === "neutral" && (
                            <i className="ri-subtract-line w-3 h-3 inline mr-1"></i>
                          )}
                          {stat.change}
                        </div>
                      </div>
                      <div
                        className="text-sm font-medium truncate"
                        style={{ color: "rgb(var(--fg-secondary))" }}
                      >
                        {stat.label}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Avatar Selection Modal */}
        {showAvatarSelector && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full mx-4"
              style={{ backgroundColor: "rgb(var(--bg-primary))" }}
            >
              <div className="flex justify-between items-center mb-6">
                <h3
                  className="text-xl font-bold"
                  style={{ color: "rgb(var(--fg-primary))" }}
                >
                  Choose Avatar
                </h3>
                <button
                  onClick={() => setShowAvatarSelector(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  <i className="ri-close-line w-4 h-4"></i>
                </button>
              </div>
              <div className="grid grid-cols-4 gap-4">
                {avatarOptions.map((seed, index) => (
                  <button
                    key={index}
                    onClick={() => handleAvatarSelect(seed)}
                    className="w-16 h-16 rounded-full overflow-hidden hover:ring-2 hover:ring-primary transition-all"
                  >
                    <UserAvatarWithFallback
                      userId={seed}
                      userName={user.name}
                      userEmail={user.email}
                      size={64}
                      className="w-full h-full"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="modern-card">
          <div
            className="border-b mb-6"
            style={{ borderColor: "rgb(var(--shade-200)) !important" }}
          >
            <div className="flex space-x-8">
              {[
                {
                  id: "personal",
                  label: "Personal Info",
                  icon: "ri-user-line",
                },
                { id: "security", label: "Security", icon: "ri-shield-line" },
                {
                  id: "preferences",
                  label: "Preferences",
                  icon: "ri-settings-line",
                },
                { id: "activity", label: "Activity", icon: "ri-history-line" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`profile-tab ${
                    activeTab === tab.id ? "active" : ""
                  }`}
                >
                  <i className={`${tab.icon} w-4 h-4 mr-2`}></i>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === "personal" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: "rgb(var(--fg-secondary)) !important" }}
                  >
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
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: "rgb(var(--fg-secondary)) !important" }}
                  >
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
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: "rgb(var(--fg-secondary)) !important" }}
                  >
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
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: "rgb(var(--fg-secondary)) !important" }}
                  >
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
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: "rgb(var(--fg-secondary)) !important" }}
                >
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

          {activeTab === "security" && (
            <div className="space-y-6">
              <div>
                <h3
                  className="text-lg font-semibold mb-4"
                  style={{ color: "rgb(var(--fg-primary)) !important" }}
                >
                  Change Password
                </h3>
                <div className="space-y-4">
                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: "rgb(var(--fg-secondary)) !important" }}
                    >
                      Current Password
                    </label>
                    <input type="password" className="modern-input" />
                  </div>
                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: "rgb(var(--fg-secondary)) !important" }}
                    >
                      New Password
                    </label>
                    <input type="password" className="modern-input" />
                  </div>
                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: "rgb(var(--fg-secondary)) !important" }}
                    >
                      Confirm New Password
                    </label>
                    <input type="password" className="modern-input" />
                  </div>
                  <button className="btn-primary">Update Password</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "preferences" && (
            <div className="space-y-6">
              <div>
                <h3
                  className="text-lg font-semibold mb-4"
                  style={{ color: "rgb(var(--fg-primary)) !important" }}
                >
                  Notifications
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p
                        className="font-medium"
                        style={{ color: "rgb(var(--fg-primary)) !important" }}
                      >
                        Email Notifications
                      </p>
                      <p
                        className="text-sm"
                        style={{ color: "rgb(var(--fg-tertiary)) !important" }}
                      >
                        Receive email updates about your projects
                      </p>
                    </div>
                    <div className="toggle-switch active"></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p
                        className="font-medium"
                        style={{ color: "rgb(var(--fg-primary)) !important" }}
                      >
                        Push Notifications
                      </p>
                      <p
                        className="text-sm"
                        style={{ color: "rgb(var(--fg-tertiary)) !important" }}
                      >
                        Get notified about important updates
                      </p>
                    </div>
                    <div className="toggle-switch"></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "activity" && (
            <div className="space-y-4">
              <h3
                className="text-lg font-semibold"
                style={{ color: "rgb(var(--fg-primary)) !important" }}
              >
                Recent Activity
              </h3>
              <div className="space-y-3">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="activity-item">
                    <div className="activity-icon">
                      <i
                        className={`${getActivityIcon(
                          activity.type
                        )} w-4 h-4 text-white`}
                      ></i>
                    </div>
                    <div className="flex-1">
                      <p
                        style={{ color: "rgb(var(--fg-primary)) !important" }}
                        className="font-medium"
                      >
                        {activity.action}
                      </p>
                      <p
                        className="text-sm"
                        style={{
                          color: "rgb(var(--fg-quaternary)) !important",
                        }}
                      >
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
