"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { routeConfig } from "../lib/config/routes";
import { ThemeToggle } from "./ThemeToggle";
import { canAccessRoute, Role } from "../lib/auth/rbac";
import { getCurrentUserRole, generateShareableLink } from "../lib/auth/session";
import { useAuth } from "../hooks/useAuth";

interface CaseType {
  id: string;
  name: string;
  href: string;
  icon: string;
  roles: Role[];
}

const caseTypes: CaseType[] = [
  {
    id: "ingredient",
    name: "New Ingredient",
    href: "/case/new/Ingredient",
    icon: "ri-flask-line",
    roles: ["Perfumer", "PaletteManager", "Admin"],
  },
  {
    id: "formula",
    name: "New Formula",
    href: "/case/new/Formula",
    icon: "ri-test-tube-line",
    roles: ["Perfumer", "Admin"],
  },
  {
    id: "project",
    name: "New Project",
    href: "/case/new/Project",
    icon: "ri-folder-add-line",
    roles: ["ProjectManager", "Admin"],
  },
  {
    id: "palette",
    name: "New Palette",
    href: "/case/new/Palette",
    icon: "ri-palette-line",
    roles: ["PaletteManager", "Perfumer", "Admin"],
  },
  {
    id: "compliance",
    name: "Compliance Run",
    href: "/case/new/Compliance",
    icon: "ri-shield-check-line",
    roles: ["ComplianceOfficer", "Perfumer", "Admin"],
  },
];

export function TopNavigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout, isSharedLink, loading } = useAuth();
  const [isCreateDropdownOpen, setIsCreateDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCreateExpanded, setIsCreateExpanded] = useState(false);

  // Force reset mobile menu state on mount for desktop
  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth >= 1024) {
      setIsMobileMenuOpen(false);
    }
  }, []);
  const [userRole, setUserRole] = useState<Role | null>(null);
  const [showShareToast, setShowShareToast] = useState(false);
  const [shouldShowHeader, setShouldShowHeader] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const createDropdownRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Close mobile menu when screen becomes larger
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        // lg breakpoint
        setIsMobileMenuOpen(false);
      }
    };

    // Initial check - ensure mobile menu is closed on desktop
    if (typeof window !== "undefined") {
      handleResize();
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Debug: Log current states
  useEffect(() => {
    if (typeof window !== "undefined") {
      console.log(
        "Window width:",
        window.innerWidth,
        "Mobile menu open:",
        isMobileMenuOpen
      );
    }
  }, [isMobileMenuOpen]);

  useEffect(() => {
    let mounted = true;

    getCurrentUserRole()
      .then((role) => {
        if (mounted) {
          setUserRole(role);
        }
      })
      .catch((error) => {
        console.warn("Failed to get user role:", error);
      });

    return () => {
      mounted = false;
    };
  }, [user]);

  useEffect(() => {
    // Determine if header should show - more permissive logic
    const checkHeaderVisibility = () => {
      if (typeof window === "undefined") {
        setShouldShowHeader(pathname !== "/login");
        return;
      }

      // Always show header if not on login page
      if (pathname !== "/login") {
        setShouldShowHeader(true);
        return;
      }

      // Check for any authentication indicators
      const hasDemo = sessionStorage.getItem("demo_authenticated") === "true";
      const hasShared =
        sessionStorage.getItem("shared_link_authenticated") === "true";
      const hasUrl =
        window.location.href.includes("shared=") ||
        window.location.href.includes("share=");
      const hasAuth = isAuthenticated || user?.isAuthenticated;

      setShouldShowHeader(Boolean(hasDemo || hasShared || hasUrl || hasAuth));
    };

    checkHeaderVisibility();
  }, [pathname, isAuthenticated, user, isSharedLink]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        createDropdownRef.current &&
        !createDropdownRef.current.contains(event.target as Node)
      ) {
        setIsCreateDropdownOpen(false);
      }
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target as Node)
      ) {
        setIsUserDropdownOpen(false);
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    function handleScroll() {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 0);
    }

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // FIXED: Move the early return AFTER all hooks to prevent React hooks violation
  if (pathname === "/login" || loading || !shouldShowHeader) {
    return null;
  }

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  const getFilteredNavItems = (items: typeof routeConfig.primary) => {
    if (!userRole) return items;
    return items.filter((item) => canAccessRoute(userRole, item.roles));
  };

  const getAccessibleCaseTypes = () => {
    if (!userRole) return [];
    return caseTypes.filter((caseType) => caseType.roles.includes(userRole));
  };

  const handleLogout = async () => {
    try {
      setIsUserDropdownOpen(false);

      // Clear all session data
      if (typeof window !== "undefined") {
        sessionStorage.clear();
        localStorage.clear();
      }

      if (isSharedLink) {
        window.location.href = "/login";
        return;
      }

      await logout();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      if (typeof window !== "undefined") {
        sessionStorage.clear();
        localStorage.clear();
        window.location.href = "/login";
      }
    }
  };

  const handleShare = async () => {
    try {
      const shareableLink = generateShareableLink();

      if (navigator.share) {
        await navigator.share({
          title: "Perfumery Platform",
          text: "Check out this page on Perfumery Platform",
          url: shareableLink,
        });
      } else {
        await navigator.clipboard.writeText(shareableLink);
        setShowShareToast(true);
        setTimeout(() => setShowShareToast(false), 3000);
      }
    } catch (error) {
      console.error("Failed to share:", error);
      try {
        const shareableLink = generateShareableLink();
        await navigator.clipboard.writeText(shareableLink);
        setShowShareToast(true);
        setTimeout(() => setShowShareToast(false), 3000);
      } catch (clipboardError) {
        console.error("Failed to copy to clipboard:", clipboardError);
      }
    }
  };

  const filteredPrimaryItems = getFilteredNavItems(routeConfig.primary);
  const filteredSecondaryItems = getFilteredNavItems(
    routeConfig.secondary
  ).filter((item) => item.id !== "logout");
  const accessibleCaseTypes = getAccessibleCaseTypes();

  // Get display user with better fallback logic
  const getDisplayUser = () => {
    if (user) return user;

    // Fallback based on session storage
    if (typeof window !== "undefined") {
      const isSharedSession =
        sessionStorage.getItem("shared_link_authenticated") === "true";
      const isDemoSession =
        sessionStorage.getItem("demo_authenticated") === "true";

      if (isSharedSession) {
        return {
          name: "Shared Admin",
          email: "shared@perfumery.com",
          role: "Admin" as Role,
          isAuthenticated: true,
          isSharedLink: true,
        };
      }

      if (isDemoSession) {
        return {
          name: sessionStorage.getItem("user_name") || "Admin User",
          email: sessionStorage.getItem("user_email") || "admin@perfumery.com",
          role: (sessionStorage.getItem("user_role") as Role) || "Admin",
          isAuthenticated: true,
          isSharedLink: false,
        };
      }
    }

    // Final fallback
    return {
      name: "User",
      email: "user@perfumery.com",
      role: "Admin" as Role,
      isAuthenticated: true,
      isSharedLink: false,
    };
  };

  const displayUser = getDisplayUser();

  return (
    <>
      <header
        className={`w-full elegant-header theme-transition sticky top-0 z-50 ${
          isScrolled ? "shadow-md" : ""
        }`}
      >
        <div className="w-full px-4 sm:px-6 py-2">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white bg-gradient-to-br from-purple-500 to-violet-600 shadow-lg">
                  <i className="ri-flask-line text-xl text-white"></i>
                </div>
                <div>
                  <h1 className="font-bold text-xl tracking-tight text-rgb-fg-primary">
                    Melody
                  </h1>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1 desktop-navigation">
              <Link
                href="/"
                className={`elegant-nav-item flex items-center gap-2 px-4 py-2 transition-all duration-200 whitespace-nowrap ${
                  pathname === "/"
                    ? "text-primary border-b-2 border-primary bg-transparent"
                    : "hover:bg-shade-100 text-rgb-fg-secondary"
                }`}
              >
                <div className="w-4 h-4 flex items-center justify-center">
                  <i className="ri-home-line text-base"></i>
                </div>
                <span className="font-medium">Home</span>
              </Link>

              <div className="relative z-30" ref={createDropdownRef}>
                <button
                  onClick={() => setIsCreateDropdownOpen(!isCreateDropdownOpen)}
                  className={`elegant-nav-item flex items-center gap-2 px-4 py-2 transition-all duration-200 whitespace-nowrap ${
                    pathname.startsWith("/case/new") || pathname === "/create"
                      ? "text-primary border-b-2 border-primary bg-transparent"
                      : "hover:bg-shade-100 text-rgb-fg-secondary"
                  }`}
                >
                  <div className="w-4 h-4 flex items-center justify-center">
                    <i className="ri-add-circle-line text-base"></i>
                  </div>
                  <span className="font-medium">Create</span>
                  <div className="w-3 h-3 flex items-center justify-center">
                    <i
                      className={`ri-arrow-${
                        isCreateDropdownOpen ? "up" : "down"
                      }-s-line text-xs transition-transform`}
                    ></i>
                  </div>
                </button>

                {isCreateDropdownOpen && (
                  <div className="absolute z-50 top-full mt-2 w-64 bg-rgb-bg-primary rounded-xl shadow-xl animate-slide-up">
                    <div className="py-2">
                      {accessibleCaseTypes.length > 0 ? (
                        accessibleCaseTypes.map((caseType) => (
                          <Link
                            key={caseType.id}
                            href={caseType.href}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-shade-100 transition-colors text-rgb-fg-primary"
                            onClick={() => setIsCreateDropdownOpen(false)}
                          >
                            <div className="w-5 h-5 flex items-center justify-center">
                              <i
                                className={`${caseType.icon} text-base text-primary`}
                              ></i>
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-sm">
                                {caseType.name}
                              </div>
                              <div className="text-xs text-rgb-fg-tertiary">
                                Create a new {caseType.name.toLowerCase()}
                              </div>
                            </div>
                          </Link>
                        ))
                      ) : (
                        <div className="px-4 py-3 text-center">
                          <i className="ri-lock-line text-2xl mb-2 text-rgb-fg-quaternary"></i>
                          <div className="text-sm font-medium text-rgb-fg-primary">
                            No Access
                          </div>
                          <div className="text-xs text-rgb-fg-tertiary">
                            Contact admin for permissions
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {filteredPrimaryItems
                .filter(
                  (item) => item.id !== "home" && item.id !== "create-new"
                )
                .map((item) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={`elegant-nav-item flex items-center gap-2 px-4 py-2 transition-all duration-200 whitespace-nowrap ${
                      isActive(item.href)
                        ? "text-primary border-b-2 border-primary bg-transparent"
                        : "hover:bg-shade-100 text-rgb-fg-secondary"
                    }`}
                  >
                    <div className="w-4 h-4 flex items-center justify-center">
                      <i className={`${item.icon} text-base`}></i>
                    </div>
                    <span className="font-medium">{item.label}</span>
                  </Link>
                ))}
            </nav>

            {/* Right side actions */}
            <div className="flex items-center gap-3">
              {/* Notifications - hidden on mobile */}
              <Link
                href="/notifications"
                className="hidden sm:flex w-10 h-10 rounded-lg items-center justify-center hover:bg-shade-100 transition-colors relative text-rgb-fg-secondary"
              >
                <i className="ri-notification-3-line text-lg"></i>
                <div
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{
                    backgroundColor: "#ef4444",
                    color: "white !important",
                  }}
                >
                  3
                </div>
              </Link>

              {/* Theme Toggle - Desktop only */}
              <div className="hidden md:block">
                <ThemeToggle />
              </div>

              {/* Mobile menu button - should only show on mobile/tablet */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden mobile-menu-button w-10 h-10 rounded-lg flex items-center justify-center hover:bg-shade-100 transition-colors text-rgb-fg-secondary"
                aria-label="Toggle mobile menu"
              >
                <i
                  className={`${
                    isMobileMenuOpen ? "ri-close-line" : "ri-menu-line"
                  } text-lg`}
                ></i>
              </button>

              {/* User Profile - Desktop only */}
              <div
                className="hidden md:block relative z-50"
                ref={userDropdownRef}
              >
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-shade-100 transition-colors"
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center shadow-md"
                    style={{ backgroundColor: "#9333ea" }}
                  >
                    <span
                      className="text-xs font-semibold"
                      style={{ color: "white" }}
                    >
                      {isSharedLink || displayUser.isSharedLink
                        ? "SA"
                        : displayUser?.name?.charAt(0) ||
                          displayUser?.email?.charAt(0) ||
                          "U"}
                    </span>
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="font-medium text-sm text-rgb-fg-primary">
                      {isSharedLink || displayUser.isSharedLink
                        ? "Shared Admin"
                        : displayUser?.name || "User"}
                    </p>
                    <p className="text-xs -mt-0.5 text-rgb-fg-tertiary">
                      {displayUser?.role}
                    </p>
                  </div>
                  <div className="w-4 h-4 flex items-center justify-center">
                    <i
                      className={`ri-arrow-${
                        isUserDropdownOpen ? "up" : "down"
                      }-s-line text-xs transition-transform text-rgb-fg-secondary`}
                    ></i>
                  </div>
                </button>

                {isUserDropdownOpen && (
                  <div className="absolute z-50 right-0 top-full mt-2 w-56 bg-rgb-bg-primary rounded-xl shadow-xl animate-slide-up">
                    <div className="py-2">
                      <div className="px-4 py-3 border-b border-shade-200">
                        <p className="font-medium text-sm text-rgb-fg-primary">
                          {isSharedLink || displayUser.isSharedLink
                            ? "Shared Admin"
                            : displayUser?.name || "User"}
                        </p>
                        <p className="text-xs text-rgb-fg-tertiary">
                          {isSharedLink || displayUser.isSharedLink
                            ? "shared@perfumery.com"
                            : displayUser?.email}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="modern-badge badge-primary text-xs">
                            {displayUser?.role}
                          </span>
                          {(isSharedLink || displayUser.isSharedLink) && (
                            <span className="modern-badge badge-success text-xs">
                              Shared Access
                            </span>
                          )}
                        </div>
                      </div>

                      {filteredSecondaryItems.map((item) => (
                        <Link
                          key={item.id}
                          href={item.href}
                          className="flex items-center gap-3 px-4 py-2.5 hover:bg-shade-100 transition-colors text-rgb-fg-secondary"
                          onClick={() => setIsUserDropdownOpen(false)}
                        >
                          <div className="w-4 h-4 flex items-center justify-center">
                            <i className={`${item.icon} text-base`}></i>
                          </div>
                          <span className="font-medium text-sm">
                            {item.label}
                          </span>
                        </Link>
                      ))}

                      <div className="px-4 py-2.5 border-b border-shade-200">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-rgb-fg-secondary">
                            Theme
                          </span>
                          <ThemeToggle />
                        </div>
                      </div>

                      <div className="pt-1">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 px-4 py-2.5 w-full text-left hover:bg-shade-100 transition-colors text-error"
                        >
                          <div className="w-4 h-4 flex items-center justify-center">
                            <i className="ri-logout-line text-base"></i>
                          </div>
                          <span className="font-medium text-sm">
                            {isSharedLink || displayUser.isSharedLink
                              ? "Close Shared View"
                              : "Logout"}
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay - Only show on mobile/tablet */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
          <div
            ref={mobileMenuRef}
            className="fixed top-0 right-0 h-full w-80 bg-rgb-bg-primary shadow-xl transform transition-transform duration-300 ease-in-out"
          >
            <div className="flex flex-col h-full">
              {/* Mobile menu header */}
              <div className="flex items-center justify-between p-4 border-b border-shade-200">
                <h2 className="text-lg font-semibold text-rgb-fg-primary">
                  Navigation
                </h2>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-shade-100 transition-colors text-rgb-fg-secondary"
                >
                  <i className="ri-close-line text-lg"></i>
                </button>
              </div>

              {/* Mobile menu content */}
              <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-2">
                  {/* Home */}
                  <Link
                    href="/"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`mobile-nav-item flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      pathname === "/"
                        ? "mobile-nav-item-selected"
                        : "text-rgb-fg-secondary hover:bg-shade-100"
                    }`}
                  >
                    <i className="ri-home-line text-lg"></i>
                    <span className="font-medium">Home</span>
                  </Link>
                  {/* Create dropdown for mobile */}
                  <div className="space-y-1">
                    <button
                      onClick={() => setIsCreateExpanded(!isCreateExpanded)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setIsCreateExpanded(!isCreateExpanded);
                        }
                      }}
                      className="mobile-nav-item flex items-center justify-between w-full px-4 py-3 rounded-lg text-rgb-fg-primary font-medium hover:bg-shade-100 transition-colors"
                      aria-expanded={isCreateExpanded}
                      aria-controls="create-submenu"
                    >
                      <div className="flex items-center gap-3">
                        <i className="ri-add-circle-line text-lg text-primary"></i>
                        <span>Create</span>
                      </div>
                      <i
                        className={`ri-arrow-${
                          isCreateExpanded ? "up" : "down"
                        }-s-line text-lg transition-transform`}
                      ></i>
                    </button>
                    <div
                      id="create-submenu"
                      className={`ml-4 space-y-1 overflow-hidden transition-all duration-300 ease-in-out ${
                        isCreateExpanded
                          ? "max-h-96 opacity-100"
                          : "max-h-0 opacity-0"
                      }`}
                    >
                      <div
                        className={`transform transition-transform duration-300 ${
                          isCreateExpanded ? "translate-y-0" : "-translate-y-2"
                        }`}
                      >
                        {accessibleCaseTypes.map((caseType) => (
                          <Link
                            key={caseType.id}
                            href={caseType.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="mobile-nav-sub-item flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-colors text-rgb-fg-secondary hover:bg-shade-100"
                          >
                            <i
                              className={`${caseType.icon} text-base text-primary`}
                            ></i>
                            <span>{caseType.name}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>{" "}
                  {/* Other navigation items */}
                  {filteredPrimaryItems
                    .filter(
                      (item) => item.id !== "home" && item.id !== "create-new"
                    )
                    .map((item) => (
                      <Link
                        key={item.id}
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`mobile-nav-item flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                          isActive(item.href)
                            ? "mobile-nav-item-selected"
                            : "text-rgb-fg-secondary hover:bg-shade-100"
                        }`}
                      >
                        <i className={`${item.icon} text-lg`}></i>
                        <span className="font-medium">{item.label}</span>
                      </Link>
                    ))}
                  {/* Notifications for mobile */}
                  <Link
                    href="/notifications"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`mobile-nav-item flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      pathname === "/notifications"
                        ? "bg-primary/10 text-primary border-l-4 border-primary"
                        : "text-rgb-fg-secondary hover:bg-shade-100"
                    }`}
                  >
                    <div className="relative">
                      <i className="ri-notification-3-line text-lg"></i>
                      <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold bg-red-500 text-white">
                        3
                      </div>
                    </div>
                    <span className="font-medium">Notifications</span>
                  </Link>
                </div>
              </div>

              {/* Mobile menu footer with user info */}
              <div className="border-t border-shade-200 p-4">
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center shadow-md"
                    style={{ backgroundColor: "#9333ea" }}
                  >
                    <span className="text-sm font-semibold text-white">
                      {isSharedLink || displayUser.isSharedLink
                        ? "SA"
                        : displayUser?.name?.charAt(0) ||
                          displayUser?.email?.charAt(0) ||
                          "U"}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm text-rgb-fg-primary">
                      {isSharedLink || displayUser.isSharedLink
                        ? "Shared Admin"
                        : displayUser?.name || "User"}
                    </p>
                    <p className="text-xs text-rgb-fg-tertiary">
                      {displayUser?.role}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  {filteredSecondaryItems.map((item) => (
                    <Link
                      key={item.id}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="mobile-nav-item flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-colors text-rgb-fg-secondary hover:bg-shade-100"
                    >
                      <i className={`${item.icon} text-base`}></i>
                      <span>{item.label}</span>
                    </Link>
                  ))}

                  <button
                    onClick={handleLogout}
                    className="mobile-nav-item flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-colors text-error hover:bg-red-50 w-full text-left"
                  >
                    <i className="ri-logout-line text-base"></i>
                    <span>
                      {isSharedLink || displayUser.isSharedLink
                        ? "Close Shared View"
                        : "Logout"}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showShareToast && (
        <div className="fixed top-20 right-6 z-50 bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-slide-up">
          <div className="w-4 h-4 flex items-center justify-center">
            <i className="ri-check-line text-base"></i>
          </div>
          <span className="text-sm font-medium">Link copied to clipboard!</span>
        </div>
      )}
    </>
  );
}
