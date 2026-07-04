"use client"

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { getAuthSession, setAuthSession, clearAuthSession, apiClient } from '../lib/actions';


// --- Types ---
export interface User {
  id: number;
  name: string;
  email: string;
  role: 'ADMIN' | 'PHOTOGRAPHER';
  avatar?: string;
  phone?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  isPhotographer: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  register: (userData: any) => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
}

// const API_BASE_URL = ';

// Production Ready Axios Instance


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Restore session from cookies on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        const savedUser = await getAuthSession();
        if (savedUser) setUser(savedUser);
      } finally {
        setIsLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      const response = await apiClient.post('/auth/login', credentials);
      const { token, user: userData } = response.data;

      if (token) {
        await setAuthSession(token, userData);
        setUser(userData);
        toast.success(`Welcome back, ${userData.name}`);
        router.refresh();
        router.push('/dashboard');
      }
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Login failed';
      toast.error(msg);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const register = useCallback(async (userData: any) => {
    setIsLoading(true);
    try {
      const response = await apiClient.post('/auth/register', userData);
      const { token, user: newUser } = response.data;
      if (token) {
        await setAuthSession(token, newUser);
        setUser(newUser);
        toast.success('Registration successful!');
        router.refresh();
        router.push('/dashboard');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const logout = useCallback(async () => {
    await clearAuthSession();
    setUser(null);
    router.push('/auth/login');
    router.refresh();
    toast.info('Signed out successfully');
  }, [router]);

  const updateUser = useCallback(async (updatedData: Partial<User>) => {
    if (user) {
      const newUser = { ...user, ...updatedData };
      setUser(newUser);
   
      await setAuthSession("", newUser); 
    }
  }, [user]);

  
const isAdmin = useMemo(() => user?.role?.toUpperCase() === 'ADMIN', [user]);
const isPhotographer = useMemo(() => user?.role?.toUpperCase() === 'PHOTOGRAPHER', [user]);
const isAuthenticated = useMemo(() => !!user, [user]);




  const value = {
    user,
    isAdmin,
    isPhotographer,
    isAuthenticated,
    isLoading,
    login,
    logout,
    register,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};