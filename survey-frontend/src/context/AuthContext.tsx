import React, { createContext, useContext, useEffect, useState } from 'react';
import { adminLogin, adminLogout, adminMe } from '@/services/api';

type AdminUser = { email: string } | null;

interface AuthContextType {
  user: AdminUser;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser>(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    try {
      const u = await adminMe();
      setUser(u);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const login = async (email: string, password: string) => {
    const u = await adminLogin(email, password);
    setUser(u);
  };

  const logout = async () => {
    await adminLogout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};