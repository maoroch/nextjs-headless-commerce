'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export interface WCUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
}

interface AuthContextValue {
  user: WCUser | null;
  token: string | null;
  loading: boolean;
  error: string;
  login: (email: string, password: string) => Promise<boolean>;
  register: (firstName: string, lastName: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<WCUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Восстановить сессию из sessionStorage
  useEffect(() => {
    try {
      const t = sessionStorage.getItem('wc_token');
      const u = sessionStorage.getItem('wc_user');
      if (t && u) { setToken(t); setUser(JSON.parse(u)); }
    } catch {}
    setLoading(false);
  }, []);

  const saveSession = (newToken: string, newUser: WCUser) => {
    setToken(newToken);
    setUser(newUser);
    try {
      sessionStorage.setItem('wc_token', newToken);
      sessionStorage.setItem('wc_user', JSON.stringify(newUser));
    } catch {}
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error?.replace(/<[^>]*>/g, '') ?? 'Invalid email or password');
        return false;
      }
      saveSession(data.token, data.user);
      return true;
    } catch {
      setError('Connection error. Please try again.');
      return false;
    }
  };

  const register = async (
    firstName: string, lastName: string, email: string, password: string
  ): Promise<boolean> => {
    setError('');
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, email, password }),
      });
      const data = await res.json();
      if (res.status === 206) {
        setError('Account created! Please sign in.');
        return false;
      }
      if (!res.ok) {
        setError(data.error?.replace(/<[^>]*>/g, '') ?? 'Registration failed');
        return false;
      }
      saveSession(data.token, data.user);
      return true;
    } catch {
      setError('Connection error. Please try again.');
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    try {
      sessionStorage.removeItem('wc_token');
      sessionStorage.removeItem('wc_user');
    } catch {}
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, error, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}