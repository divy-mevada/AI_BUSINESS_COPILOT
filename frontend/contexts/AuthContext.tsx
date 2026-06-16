'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../lib/api';

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  profile_picture?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (data: any) => Promise<void>;
  signup: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  googleLogin: (token: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          const res = await api.get('/users/me/');
          setUser(res.data);
        } catch (error) {
          console.error('Failed to load user', error);
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  const login = async (data: any) => {
    const res = await api.post('/users/login/', data);
    localStorage.setItem('access_token', res.data.access);
    localStorage.setItem('refresh_token', res.data.refresh);
    document.cookie = `access_token=${res.data.access}; path=/`;
    document.cookie = `refresh_token=${res.data.refresh}; path=/`;
    setUser(res.data.user);
  };

  const signup = async (data: any) => {
    const res = await api.post('/users/register/', data);
    localStorage.setItem('access_token', res.data.access);
    localStorage.setItem('refresh_token', res.data.refresh);
    document.cookie = `access_token=${res.data.access}; path=/`;
    document.cookie = `refresh_token=${res.data.refresh}; path=/`;
    setUser(res.data.user);
  };

  const logout = async () => {
    try {
      const refresh = localStorage.getItem('refresh_token');
      if (refresh) {
        await api.post('/users/logout/', { refresh });
      }
    } catch (e) {
      // The token might already be invalid/expired on the server.
      // We can safely ignore this 400 error since we are clearing local state anyway.
      console.warn('Logout API request failed (likely an already invalid or expired token). Proceeding with local logout.');
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      document.cookie = 'access_token=; Max-Age=0; path=/';
      document.cookie = 'refresh_token=; Max-Age=0; path=/';
      setUser(null);
      window.location.href = '/landing';
    }
  };

  const googleLogin = async (token: string) => {
    const res = await api.post('/users/google/', { token });
    localStorage.setItem('access_token', res.data.access);
    localStorage.setItem('refresh_token', res.data.refresh);
    document.cookie = `access_token=${res.data.access}; path=/`;
    document.cookie = `refresh_token=${res.data.refresh}; path=/`;
    setUser(res.data.user);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, googleLogin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
