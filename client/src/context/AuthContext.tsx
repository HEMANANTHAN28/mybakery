'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  phone?: string;
  address?: string;
  token?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (profileData: { name: string; email: string; phone?: string; address?: string; password?: string }) => Promise<boolean>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = 'https://bakery-backend.onrender.com/api/auth';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load user from localStorage on mount
    const storedUser = localStorage.getItem('bakery_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('bakery_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }

      setUser(data);
      localStorage.setItem('bakery_user', JSON.stringify(data));
      setLoading(false);
      return true;
    } catch (err: any) {
      setError(err.message || 'An error occurred during login');
      setLoading(false);
      return false;
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      setUser(data);
      localStorage.setItem('bakery_user', JSON.stringify(data));
      setLoading(false);
      return true;
    } catch (err: any) {
      setError(err.message || 'An error occurred during registration');
      setLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('bakery_user');
  };

  const updateProfile = async (profileData: {
    name: string;
    email: string;
    phone?: string;
    address?: string;
    password?: string;
  }): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      if (!user || !user.token) {
        throw new Error('Not authenticated');
      }

      const res = await fetch(`${API_URL}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(profileData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Profile update failed');
      }

      setUser(data);
      localStorage.setItem('bakery_user', JSON.stringify(data));
      setLoading(false);
      return true;
    } catch (err: any) {
      setError(err.message || 'An error occurred while updating profile');
      setLoading(false);
      return false;
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout, updateProfile, clearError }}>
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
