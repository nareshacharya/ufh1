"use client";

import { useState, useRef, useEffect } from "react";
import { Breadcrumb } from "@/components/Breadcrumb";
import { UserAvatarWithFallback } from "@/components/UserAvatar";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("overview");
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
    { label: "User", href: "/profile", icon: "ri-user-line" },
    { label: "Settings", icon: "ri-settings-line" },
  ];

  const user = {
    name: "John Smith",
    email: "john.smith@foodinnovation.com",
    role: "Senior Product Manager",
    department: "R&D Food Innovation",
    joinDate: "2022-03-15",
    location: "New York, USA",
    phone: "+1 (555) 123-4567",
    bio: "Passionate product manager with over 8 years of experience in food innovation and sustainable development. Leading cross-functional teams to deliver exceptional product experiences.",
    avatar: null,
    timezone: "UTC-08:00 - Pacific Standard Time (PST)",
    dateOfBirth: "",
    language: "English",
    gender: "",
    address:
      "92 Miles Drive, Newark, NJ 07103, California, United States of America",
    socialLinks: {
      linkedin: "john-smith",
      twitter: "@johnsmith_food",
    },
    skills: ["React", "TypeScript", "Product Management", "Food Science"],
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: "ri-dashboard-line" },
    { id: "notification", label: "Notification", icon: "ri-notification-line" },
    { id: "projects", label: "Projects", icon: "ri-folder-line" },
    { id: "invoice", label: "Invoice", icon: "ri-file-text-line" },
    { id: "account", label: "Account", icon: "ri-user-settings-line" },
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

  const handleAvatarSelect = (seed: string) => {
    setSelectedAvatarSeed(seed);
    setShowAvatarSelector(false);
    if (typeof window !== "undefined") {
      localStorage.setItem("userAvatarSeed", seed);
      window.dispatchEvent(
        new CustomEvent("avatarChanged", { detail: { seed } })
      );
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log("File selected:", file.name);
      // TODO: Upload to backend
    }
  };

  return (
    <div className="p-4 lg:p-6 w-full min-h-screen">
      <div className="animate-fade-in">
        {/* Header */}
        <div className="mb-6">
          <Breadcrumb items={breadcrumbItems} />
          <h1
            className="text-3xl font-bold mt-4"
            style={{ color: "rgb(var(--fg-primary))" }}
          >
            Settings
          </h1>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div
            className="flex space-x-1 bg-opacity-50 rounded-lg p-1"
            style={{ backgroundColor: "rgba(var(--bg-secondary), 0.5)" }}
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-md font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? "bg-primary text-white shadow-md"
                    : "text-gray-600 hover:text-gray-800 hover:bg-white/50"
                }`}
              >
                <i className={`${tab.icon} w-4 h-4 mr-2 inline`}></i>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Overview Tab Content */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Profile Picture Section */}
            <div className="space-y-8">
              {/* Profile Picture Card */}
              <div className="modern-card p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <h3
                      className="text-lg font-semibold"
                      style={{ color: "rgb(var(--fg-primary))" }}
                    >
                      Profile picture
                    </h3>
                    <i className="ri-information-line w-4 h-4 text-gray-400"></i>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full overflow-hidden ring-2 ring-gray-200">
                      <UserAvatarWithFallback
                        userId={selectedAvatarSeed}
                        userName={user.name}
                        userEmail={user.email}
                        profileImage={user.avatar || undefined}
                        size={80}
                        className="w-full h-full"
                      />
                    </div>
                    <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                      PRO
                    </span>
                  </div>

                  <div className="flex-1">
                    <h4
                      className="text-xl font-semibold mb-1"
                      style={{ color: "rgb(var(--fg-primary))" }}
                    >
                      {user.name}
                    </h4>
                    <p className="text-gray-500 mb-4">{user.role}</p>

                    <button
                      onClick={() => setShowAvatarSelector(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      <i className="ri-edit-line w-4 h-4"></i>
                      Edit
                    </button>
                  </div>
                </div>
              </div>

              {/* Personal Information Card */}
              <div className="modern-card p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <h3
                      className="text-lg font-semibold"
                      style={{ color: "rgb(var(--fg-primary))" }}
                    >
                      Personal information
                    </h3>
                    <i className="ri-information-line w-4 h-4 text-gray-400"></i>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Full name
                    </label>
                    <p className="text-gray-400">{user.name}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Email Address
                    </label>
                    <p className="text-gray-400">{user.email}</p>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Biography
                    </label>
                    <p className="text-gray-400 leading-relaxed">{user.bio}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Home Address
                    </label>
                    <p className="text-gray-400">{user.address}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Phone Number
                    </label>
                    <p className="text-gray-400">{user.phone}</p>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Software Skills
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {user.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Social
                  </label>
                  <div className="flex gap-4">
                    <a
                      href={`https://linkedin.com/in/${user.socialLinks.linkedin}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white hover:bg-blue-700 transition-colors"
                    >
                      <i className="ri-linkedin-fill w-4 h-4"></i>
                    </a>
                    <a
                      href={`https://twitter.com/${user.socialLinks.twitter.replace(
                        "@",
                        ""
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 bg-black rounded flex items-center justify-center text-white hover:bg-gray-800 transition-colors"
                    >
                      <i className="ri-twitter-x-fill w-4 h-4"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Settings Forms */}
            <div className="space-y-8">
              {/* Timezone & Language Settings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                    Timezone
                    <i className="ri-information-line w-4 h-4 text-gray-400"></i>
                  </label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white">
                    <option>{user.timezone}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Language
                  </label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white">
                    <option>Choose your account type</option>
                    <option>English</option>
                    <option>Spanish</option>
                    <option>French</option>
                  </select>
                </div>
              </div>

              {/* Date of Birth & Gender */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Date of birth
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                      placeholder="Select date"
                    />
                    <i className="ri-calendar-line absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"></i>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Gender
                  </label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white">
                    <option>Choose your gender</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                    <option>Prefer not to say</option>
                  </select>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end">
                <button className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium">
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Other Tab Contents */}
        {activeTab !== "overview" && (
          <div className="modern-card p-8 text-center">
            <div className="max-w-md mx-auto">
              <i
                className={`${
                  tabs.find((t) => t.id === activeTab)?.icon
                } w-12 h-12 mx-auto mb-4 text-gray-400`}
              ></i>
              <h3
                className="text-xl font-semibold mb-2"
                style={{ color: "rgb(var(--fg-primary))" }}
              >
                {tabs.find((t) => t.id === activeTab)?.label}
              </h3>
              <p className="text-gray-500">
                This section is under development. Content for{" "}
                {tabs.find((t) => t.id === activeTab)?.label.toLowerCase()} will
                be available soon.
              </p>
            </div>
          </div>
        )}

        {/* Avatar Selection Modal */}
        {showAvatarSelector && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div
              className="bg-white rounded-2xl p-6 max-w-md w-full mx-4"
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
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200"
                >
                  <i className="ri-close-line w-4 h-4"></i>
                </button>
              </div>
              <div className="grid grid-cols-4 gap-4">
                {avatarOptions.map((seed, index) => (
                  <button
                    key={index}
                    onClick={() => handleAvatarSelect(seed)}
                    className="w-16 h-16 rounded-full overflow-hidden hover:ring-2 hover:ring-blue-500 transition-all"
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

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </div>
  );
}
