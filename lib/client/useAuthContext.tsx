'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

interface AuthState {
  loading: boolean;
  isAuthenticated: boolean;
  userId: string | null;
  userRole: string | null;
  username: string | null;
  fullName: string | null;
  authUser: any | null;
  isAdmin: boolean;
  isClient: boolean;
}

interface AuthContextValue extends AuthState {
  refreshSession: () => Promise<void>;
}

const defaultState: AuthContextValue = {
  loading: true,
  isAuthenticated: false,
  userId: null,
  userRole: null,
  username: null,
  fullName: null,
  authUser: null,
  isAdmin: false,
  isClient: false,
  refreshSession: async () => {},
};

const AuthContext = createContext<AuthContextValue>(defaultState);

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    loading: true,
    isAuthenticated: false,
    userId: null,
    userRole: null,
    username: null,
    fullName: null,
    authUser: null,
    isAdmin: false,
    isClient: false,
  });
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams?.toString() ?? '';
  const hasFetchedOnce = useRef(false);

  const fetchSession = useCallback(async () => {
    const res = await fetch('/api/session', { cache: 'no-store' });
    const { session } = await res.json();
    if (process.env.NEXT_PUBLIC_DEBUG_AUTH === '1') {
      console.log('[fetchSession] session', session);
    }
    return session as any | null;
  }, []);

  const refreshSession = useCallback(async () => {
    try {
      const session = await fetchSession();
      if (!session) {
        setState({
          loading: false,
          isAuthenticated: false,
          userId: null,
          userRole: null,
          username: null,
          fullName: null,
          authUser: null,
          isAdmin: false,
          isClient: false,
        });
        return;
      }
      setState({
        loading: false,
        isAuthenticated: true,
        userId: session.userId,
        userRole: session.userRole ?? null,
        username: session.username ?? null,
        fullName: session.fullName ?? null,
        authUser: session,
        isAdmin: session.userRole === 'admin',
        isClient: session.userRole === 'client',
      });
      if (process.env.NEXT_PUBLIC_DEBUG_AUTH === '1') {
        console.log('[refreshSession] updated state', session);
      }
    } catch (err) {
      if (process.env.NEXT_PUBLIC_DEBUG_AUTH === '1') {
        console.error('[refreshSession] failed', err);
      }
      setState({
        loading: false,
        isAuthenticated: false,
        userId: null,
        userRole: null,
        username: null,
        fullName: null,
        authUser: null,
        isAdmin: false,
        isClient: false,
      });
    }
  }, [fetchSession]);

  useEffect(() => {
    if (hasFetchedOnce.current) {
      refreshSession();
    } else {
      hasFetchedOnce.current = true;
      refreshSession();
    }
  }, [pathname, search, refreshSession]);

  const value: AuthContextValue = { ...state, refreshSession };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
