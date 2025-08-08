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
  refreshSession: () => Promise<void>;
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
    userId: null,
    username: null,
    userRole: null,
    isClient: false,
    isAdmin: false,
    isAuthenticated: false,
    loading: true,
    authUser: null,
  });
  const hasFetchedOnce = useRef(false);

  const fetchSession = useCallback(async () => {
    const res = await fetch('/api/session');
    if (!res.ok) throw new Error('no session');
    const { user } = await res.json();
    if (process.env.NODE_ENV === 'development') {
      console.log('[fetchSession] resolved user', user);
    }
    return user as any | null;
  }, []);

  const refreshSession = useCallback(async () => {
    if (process.env.NODE_ENV === 'development') {
      console.log('[refreshSession] start');
    }
    try {
      const user = await fetchSession();
      if (!user) {
        console.warn('[AuthProvider] Session resolved as null');
        setState({
          userId: null,
          username: null,
          userRole: null,
          isClient: false,
          isAdmin: false,
          isAuthenticated: false,
          loading: false,
          authUser: null,
        });
        return;
      }
      setState({
        userId: user.userId,
        username: null,
        userRole: user.userRole,
        isClient: user.userRole === 'client',
        isAdmin: user.userRole === 'admin',
        isAuthenticated: true,
        loading: false,
        authUser: user,
      });
      if (process.env.NODE_ENV === 'development') {
        console.log('[refreshSession] updated state', user);
      }
    } catch (err) {
      console.error('Failed loading session', err);
      setState({
        userId: null,
        username: null,
        userRole: null,
        isClient: false,
        isAdmin: false,
        isAuthenticated: false,
        loading: false,
        authUser: null,
      });
    }
  }, [fetchSession]);

  useEffect(() => {
    if (hasFetchedOnce.current) return;
    hasFetchedOnce.current = true;
    refreshSession();
    if (process.env.NODE_ENV === 'development') {
      console.log('[AuthProvider] initial refreshSession');
    }
  }, [refreshSession]);

  const value = { ...state, refreshSession };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
