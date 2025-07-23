'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export interface AuthState {
  userId: string | null;
  username: string | null;
  userRole: string | null;
  isAdmin: boolean;
  isAuthenticated: boolean;
  loading: boolean;
  authUser: any;
  refreshSession: () => Promise<void>;
}

const defaultState: AuthState = {
  userId: null,
  username: null,
  userRole: null,
  isAdmin: false,
  isAuthenticated: false,
  loading: true,
  authUser: null,
  refreshSession: async () => {},
};

const AuthContext = createContext<AuthState>(defaultState);

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState(defaultState);

  const fetchSession = async () => {
      try {
        const res = await fetch('/api/session');
        if (!res.ok) throw new Error('no session');
        const { user } = await res.json();
        if (!user) {
          console.warn('[AuthProvider] Session resolved as null');
          setState((s) => ({ ...s, loading: false, refreshSession: fetchSession }));
          return;
        }
        setState({
          userId: user.id,
          username: user.username || user.id,
          userRole: user.user_role,
          isAdmin: user.user_role === 'admin',
          isAuthenticated: true,
          loading: false,
          authUser: user,
          refreshSession: fetchSession,
        });
      } catch (err) {
        console.error('Failed loading session', err);
        setState((s) => ({ ...s, loading: false, refreshSession: fetchSession }));
      }
  };

  useEffect(() => {
    fetchSession();
  }, []);

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
}
