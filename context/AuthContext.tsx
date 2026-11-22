
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
import {
  getAuthSession,
  setAuthSession,
  clearAuthSession,
} from "../lib/actions";
import axios from "axios";

// =========================
// TYPES
// =========================

export interface User {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "SALES" | "PHOTOGRAPHER" | "CLIENT";
  avatar?: string;
  phone?: string;
  isBlocked?: boolean;
}

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  isSales: boolean;
  isPhotographer: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;

  login: (
    email: string,
    password: string
  ) => Promise<{
    success: boolean;
    user?: User;
    message?: string;
  }>;

  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

// =========================
// AUTH PROVIDER
// =========================

export const AuthProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {

  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  // =========================
  // RESTORE AUTH SESSION
  // =========================

  useEffect(() => {
    const initAuth = async () => {
      try {
        const savedUser = await getAuthSession();

        if (savedUser) {
          setUser(savedUser as User);
        }
      } catch (error) {
        console.error("Failed to restore session:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  // =========================
  // LOGIN
  // =========================

  const login = useCallback(
    async (email: string, password: string) => {

      setIsLoading(true);

      try {

        const response = await axios.post(
          `${BASE_URL}/auth/login`,
          {
            email,
            password,
          }
        );

        const {
          user,
          accessToken,
          refreshToken,
        } = response.data;

        if (!user || !accessToken) {
          throw new Error("Invalid login response");
        }

        if (user.isBlocked || user.blocked) {
          throw new Error("Your account has been suspended.");
        }

        // Save access token
        localStorage.setItem("accessToken", accessToken);

        // Keep compatibility with existing API calls
        localStorage.setItem("token", accessToken);

        // Save refresh token
        if (refreshToken) {
          localStorage.setItem("refreshToken", refreshToken);
        }

        // Save login status
        localStorage.setItem("is_login", "true");

        // Save user
        localStorage.setItem("user", JSON.stringify(user));

        // Save session
        await setAuthSession(accessToken, user);

        setUser(user);

        return {
          success: true,
          message: "Login successful",
          user,
        };

      } catch (error: any) {

        console.error(
          "Login failed:",
          error.response?.data?.message || error.message
        );

        return {
          success: false,
          message:
            error.response?.data?.message ||
            error.message ||
            "Invalid email or password",
        };

      } finally {
        setIsLoading(false);
      }
    },
    [BASE_URL]
  );

  // =========================
  // LOGOUT
  // =========================

  const logout = useCallback(async () => {

    try {

      const token = localStorage.getItem("accessToken");

      if (token && BASE_URL) {

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

      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("token");
      localStorage.removeItem("is_login");
      localStorage.removeItem("user");

      await clearAuthSession();

      setUser(null);

      toast.info("Signed out successfully");

      window.location.href = "/auth/login";
    }

  }, [BASE_URL]);

  // =========================
  // INACTIVITY TIMEOUT
  // =========================

  useEffect(() => {

    if (!user) return;

    let timer: ReturnType<typeof setTimeout>;

    const INACTIVITY_TIMEOUT =
      24 * 60 * 60 * 1000;

    const handleInactivity = async () => {
      await logout();
      toast.warning("Session expired due to inactivity.");
    };

    const resetTimer = () => {
      clearTimeout(timer);

      timer = setTimeout(
        handleInactivity,
        INACTIVITY_TIMEOUT
      );
    };

    const events = [
      "mousemove",
      "keydown",
      "click",
      "scroll",
      "touchstart",
    ];

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

  // =========================
  // ROLE CHECKS
  // =========================

  const isAdmin = user?.role === "ADMIN";

  const isSales = user?.role === "SALES";

  const isPhotographer =
    user?.role === "PHOTOGRAPHER";

  const isAuthenticated = !!user;

  // =========================
  // CONTEXT VALUE
  // =========================

  const value = useMemo(
    () => ({
      user,
      isAdmin,
      isSales,
      isPhotographer,
      isAuthenticated,
      isLoading,
      login,
      logout,
    }),
    [
      user,
      isAdmin,
      isSales,
      isPhotographer,
      isAuthenticated,
      isLoading,
      login,
      logout,
    ]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// =========================
// CUSTOM HOOK
// =========================

export const useAuth = () => {

  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used within AuthProvider"
    );
  }

  return context;
};
