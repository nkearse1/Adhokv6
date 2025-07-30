'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

export interface AuthState {
  userId: string | null;
  username: string | null;
  userRole: string | null;
  isClient?: boolean;
  isAdmin: boolean;
  isAuthenticated: boolean;
  loading: boolean;
  authUser: any;
  refreshSession: (opts?: { userId?: string }) => Promise<void>;
}

const defaultState: AuthState = {
  userId: null,
  username: null,
  userRole: null,
  isClient: false,
  isAdmin: false,
  isAuthenticated: false,
  loading: true,
  authUser: null,
  refreshSession: async () => {},
};

const AuthContext = createContext<AuthState>(defaultState);

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<Omit<AuthState, 'refreshSession'>>({
    userId: null as string | null,
    username: null as string | null,
    userRole: null as string | null,
    isClient: false,
    isAdmin: false,
    isAuthenticated: false,
    loading: true,
    authUser: null as any,
  });
  const hasFetchedOnce = useRef(false);

  const refreshSession = useCallback(async (opts?: { userId?: string }) => {
    try {
      const headers: Record<string, string> = {};
      const override =
        opts?.userId ??
        (typeof window !== 'undefined'
          ? window.localStorage.getItem('adhok_active_user') || undefined
          : undefined);
      if (override) headers['adhok_active_user'] = override;
      const res = await fetch('/api/session', { headers });
      if (!res.ok) throw new Error('no session');
      const { user } = await res.json();
      if (!user) {
        console.warn('[AuthProvider] Session resolved as null');
        setState((s) => ({ ...s, loading: false }));
        return;
      }
      setState({
        userId: user.id,
        username: user.username || user.id,
        userRole: user.user_role,
        isClient: user.isClient || false,
        isAdmin: user.user_role === 'admin',
        isAuthenticated: true,
        loading: false,
        authUser: user,
      });
    } catch (err) {
      console.error('Failed loading session', err);
      setState((s) => ({ ...s, loading: false }));
    }
  }, []);

  useEffect(() => {
    if (hasFetchedOnce.current) return;
    hasFetchedOnce.current = true;
    refreshSession();
  }, [refreshSession]);

  const value = { ...state, refreshSession };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
