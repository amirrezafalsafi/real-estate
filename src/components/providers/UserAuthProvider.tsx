"use client";

import React, { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  avatar?: string | null;
  createdAt?: string;
}

interface UserAuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  setUser: (user: UserProfile | null) => void;
}

const UserAuthContext = createContext<UserAuthContextType | undefined>(undefined);

export function UserAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchCurrentUser = async () => {
    try {
      const res = await fetch("/api/auth/me", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user || null);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      router.push("/");
      router.refresh();
    } catch {
      setUser(null);
    }
  };

  const refreshUser = async () => {
    await fetchCurrentUser();
  };

  return (
    <UserAuthContext.Provider value={{ user, isLoading, logout, refreshUser, setUser }}>
      {children}
    </UserAuthContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserAuthContext);
  if (!context) {
    throw new Error("useUser must be used within a UserAuthProvider");
  }
  return context;
}

export const useUserAuth = useUser;

export default UserAuthProvider;
