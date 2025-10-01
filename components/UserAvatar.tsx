"use client";

import { createAvatar } from "@dicebear/core";
import { personas } from "@dicebear/collection";
import { useMemo } from "react";

interface UserAvatarProps {
  userId?: string;
  userName?: string;
  size?: number;
  className?: string;
}

export function UserAvatar({
  userId = "default",
  userName = "User",
  size = 32,
  className = "",
}: UserAvatarProps) {
  const avatarSvg = useMemo(() => {
    // Use userId or userName as seed for consistent avatar generation
    const seed = userId !== "default" ? userId : userName;

    const avatar = createAvatar(personas, {
      seed,
      size,
      // Customize the avatar style
      backgroundColor: ["b6e3f4", "c0aede", "d1d4f9", "ffd5dc", "ffdfbf"],
      // You can add more customization options here
    });

    return avatar.toString();
  }, [userId, userName, size]);

  return (
    <div
      className={`rounded-full overflow-hidden flex items-center justify-center ${className}`}
      style={{
        width: size,
        height: size,
      }}
      dangerouslySetInnerHTML={{ __html: avatarSvg }}
    />
  );
}

// Alternative avatar component using initials as fallback
export function UserAvatarWithFallback({
  userId = "default",
  userName = "User",
  userEmail,
  profileImage,
  size = 32,
  className = "",
}: UserAvatarProps & { userEmail?: string; profileImage?: string }) {
  const getInitials = (name: string, email?: string) => {
    if (name && name !== "User") {
      const names = name.split(" ");
      if (names.length >= 2) {
        return (names[0][0] + names[names.length - 1][0]).toUpperCase();
      }
      return name.slice(0, 2).toUpperCase();
    }

    if (email) {
      return email.slice(0, 2).toUpperCase();
    }

    return "U";
  };

  const avatarSvg = useMemo(() => {
    const seed = userId !== "default" ? userId : userName;

    const avatar = createAvatar(personas, {
      seed,
      size,
      backgroundColor: ["b6e3f4", "c0aede", "d1d4f9", "ffd5dc", "ffdfbf"],
    });

    return avatar.toString();
  }, [userId, userName, size]);

  // If user has uploaded a profile image, use that
  if (profileImage) {
    return (
      <img
        src={profileImage}
        alt={`${userName}'s profile`}
        className={`rounded-full object-cover ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }

  // Use generated avatar
  return (
    <div
      className={`rounded-full overflow-hidden flex items-center justify-center ${className}`}
      style={{
        width: size,
        height: size,
      }}
      dangerouslySetInnerHTML={{ __html: avatarSvg }}
    />
  );
}
