"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthResponse } from "@/types";
import { useSession, signOut } from "next-auth/react";
import { api } from "@/lib/api";

interface AuthContextType {
  user: AuthResponse | null;
  isLoading: boolean;
  login: (data: AuthResponse) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status: sessionStatus } = useSession();
  const [user, setUser] = useState<AuthResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (sessionStatus === "loading") return; // Wait for session to load

    if (session?.user) {
      // For OAuth users, use session info with default roles (no backend fetch needed)
      const authUser: AuthResponse = {
        id: session.user.id ? (typeof session.user.id === 'string' ? parseInt(session.user.id, 10) : session.user.id) : 0,
        username: session.user.name || session.user.email || "User",
        email: session.user.email || "",
        accessToken: "oauth_token",
        tokenType: "Bearer",
        roles: ["CUSTOMER"], // Default role for OAuth users
        firstName: session.user.name?.split(" ")[0] || "",
        lastName: session.user.name?.split(" ")[1] || "",
      };
      setUser(authUser);
      localStorage.setItem("user", JSON.stringify(authUser));
      localStorage.setItem("token", authUser.accessToken);
      setIsLoading(false);
    } else {
      // Fallback to localStorage for traditional auth
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          localStorage.removeItem("user");
          localStorage.removeItem("token");
        }
      }
      setIsLoading(false);
    }
  }, [session, sessionStatus]);

  const login = (data: AuthResponse) => {
    setUser(data);
    localStorage.setItem("user", JSON.stringify(data));
    localStorage.setItem("token", data.accessToken);
  };

  const logout = async () => {
    // Clear local state and storage
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    
    // Sign out from NextAuth if session exists
    if (session) {
      await signOut({ redirect: false });
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
