"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  getAuthSession,
  setAuthSession,
  clearAuthSession,
  apiClient,
} from "../lib/actions";
import axios from "axios";

// --- Types ---
export interface User {
  id: number;
  name: string;
  email: string;
  role: "ADMIN" | "PHOTOGRAPHER";
  avatar?: string;
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  isPhotographer: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ 
    success: boolean; 
    user?: User;      
    message?: string; 
  }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const initAuth = async () => {
      try {
        const savedUser = await getAuthSession();
        if (savedUser) setUser(savedUser);
      } catch (error) {
        console.error("Failed to restore session:", error);
      } finally {
        setIsLoading(false);
      }
    };
    initAuth();
  }, []);

  const logout = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        await axios.post(
          `${BASE_URL}/auth/logout-all`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
      }
    } catch (error) {
      console.error("Logout API call failed:", error);
    } finally {
      await clearAuthSession();
      setUser(null);
      router.push("/auth/login");
      toast.info("Signed out successfully");
    }
  }, [router, BASE_URL]);

  // ⏱️ Inactivity Timeout Logic (Dakika 5)
  useEffect(() => {
    if (!user) return;

    let timer: NodeJS.Timeout;
    const INACTIVITY_TIMEOUT = 5 * 60 * 1000; // 5 Minutes

    const handleInactivity = async () => {
      await logout();
      toast.warning("Session expired due to inactivity.");
    };

    const resetTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(handleInactivity, INACTIVITY_TIMEOUT);
    };

    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];
    
    events.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });

    resetTimer();

    return () => {
      clearTimeout(timer);
      events.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [user, logout]);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/auth/login`, { email, password });

      const { accessToken, user } = response.data;
      
      localStorage.setItem("is_login", "true");
      localStorage.setItem("token", accessToken);
      
      await setAuthSession(accessToken, user);
      setUser(user);
      
      return { success: true, user };
    } catch (error: any) {
      console.error("Login failed:", error.response?.data?.message || error.message);
      
      return { 
        success: false, 
        message: error.response?.data?.message || "Invalid email or password" 
      };
    } finally {
      setIsLoading(false);
    }
  }, [BASE_URL]);

  const isPhotographer = user?.role === "PHOTOGRAPHER";
  const isAuthenticated = !!user;

  const value = useMemo(
    () => ({
      user,
      isPhotographer,
      isAuthenticated,
      isLoading,
      login,
      logout,
    }),
    [user, isPhotographer, isAuthenticated, isLoading, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};