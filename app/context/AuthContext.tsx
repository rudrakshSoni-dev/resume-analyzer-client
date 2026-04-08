"use client"
import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { User, StoredUser } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  switchUserContext: (storedUser: StoredUser) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const active = Cookies.get('ra_active_user');
    if (active) {
      const parsed: StoredUser = JSON.parse(active);
      setUser({ id: parsed.userId, name: parsed.name, email: parsed.email });
      setToken(parsed.token);
    }
  }, []);

  const login = (newUser: User, newToken: string) => {
    setUser(newUser);
    setToken(newToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  const switchUserContext = (storedUser: StoredUser) => {
    setUser({ id: storedUser.userId, name: storedUser.name, email: storedUser.email });
    setToken(storedUser.token);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, switchUserContext }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};