
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types';
import { supabase } from '@/lib/supabase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error: string | null }>;
  loginWithPhone: (phone: string, password: string) => Promise<{ error: string | null }>;
  register: (email: string, phone: string, password: string) => Promise<{ error: string | null }>;
  logout: () => Promise<void>;
  updateBalance: (amount: number) => void;
  claimBonus: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Simulate fetching user data
  useEffect(() => {
    // In a real app, you would check for an existing session
    const checkUser = async () => {
      try {
        // For demo purposes, we'll use localStorage to simulate persistence
        const storedUser = localStorage.getItem('aviator_user');
        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            // Ensure all required properties exist
            setUser({
              id: parsedUser.id || '1',
              email: parsedUser.email || '',
              phone: parsedUser.phone || '',
              balance: typeof parsedUser.balance === 'number' ? parsedUser.balance : 1000,
              bonus: typeof parsedUser.bonus === 'number' ? parsedUser.bonus : 0,
              pendingWithdrawals: typeof parsedUser.pendingWithdrawals === 'number' ? parsedUser.pendingWithdrawals : 0
            });
          } catch (parseError) {
            console.error('Error parsing stored user:', parseError);
            setUser(null);
          }
        }
      } catch (error) {
        console.error('Error checking user:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('aviator_user', JSON.stringify(user));
    }
  }, [user]);

  const login = async (email: string, password: string) => {
    try {
      // In a real app, you would verify credentials with Supabase
      // For demo, we'll create a mock user
      if (email && password) {
        setUser({
          id: '1',
          email,
          phone: '',
          balance: 1000,
          bonus: 0,
          pendingWithdrawals: 0
        });
        return { error: null };
      }
      return { error: 'Invalid credentials' };
    } catch (error) {
      console.error('Login error:', error);
      return { error: 'Login failed' };
    }
  };

  const loginWithPhone = async (phone: string, password: string) => {
    try {
      // Similar to email login but with phone
      if (phone && password) {
        setUser({
          id: '1',
          email: '',
          phone,
          balance: 1000,
          bonus: 0,
          pendingWithdrawals: 0
        });
        return { error: null };
      }
      return { error: 'Invalid credentials' };
    } catch (error) {
      console.error('Login error:', error);
      return { error: 'Login failed' };
    }
  };

  const register = async (email: string, phone: string, password: string) => {
    try {
      // In a real app, you would create a user in Supabase
      if (email && phone && password) {
        setUser({
          id: '1',
          email,
          phone,
          balance: 1000,
          bonus: 0,
          pendingWithdrawals: 0
        });
        return { error: null };
      }
      return { error: 'Invalid registration data' };
    } catch (error) {
      console.error('Registration error:', error);
      return { error: 'Registration failed' };
    }
  };

  const logout = async () => {
    // In a real app, you would sign out from Supabase
    setUser(null);
    localStorage.removeItem('aviator_user');
  };

  const updateBalance = (amount: number) => {
    if (user) {
      setUser({
        ...user,
        balance: user.balance + amount
      });
    }
  };

  const claimBonus = () => {
    if (user) {
      setUser({
        ...user,
        bonus: 0,
        balance: user.balance + 18000 // 100% of KES 18,000
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        loginWithPhone,
        register,
        logout,
        updateBalance,
        claimBonus
      }}
    >
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