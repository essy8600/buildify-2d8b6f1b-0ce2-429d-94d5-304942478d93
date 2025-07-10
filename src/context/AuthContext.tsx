
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types';
import { supabase } from '@/lib/supabase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error: any }>;
  register: (email: string, phone: string, password: string) => Promise<{ error: any }>;
  logout: () => Promise<void>;
  updateBalance: (newBalance: number) => void;
  addBonus: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for user in localStorage (mock authentication)
    const storedUser = localStorage.getItem('aviator_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // Mock authentication
      const mockUser: User = {
        id: '1',
        email,
        balance: 1000,
        bonus: 0,
      };
      
      setUser(mockUser);
      localStorage.setItem('aviator_user', JSON.stringify(mockUser));
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const register = async (email: string, phone: string, password: string) => {
    try {
      // Mock registration
      const mockUser: User = {
        id: '1',
        email,
        phone,
        balance: 1000,
        bonus: 0,
      };
      
      setUser(mockUser);
      localStorage.setItem('aviator_user', JSON.stringify(mockUser));
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const logout = async () => {
    localStorage.removeItem('aviator_user');
    setUser(null);
  };

  const updateBalance = (newBalance: number) => {
    if (user) {
      const updatedUser = { ...user, balance: newBalance };
      setUser(updatedUser);
      localStorage.setItem('aviator_user', JSON.stringify(updatedUser));
    }
  };

  const addBonus = () => {
    if (user) {
      const bonusAmount = 18000;
      const updatedUser = { 
        ...user, 
        balance: user.balance + bonusAmount,
        bonus: user.bonus + bonusAmount 
      };
      setUser(updatedUser);
      localStorage.setItem('aviator_user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateBalance, addBonus }}>
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