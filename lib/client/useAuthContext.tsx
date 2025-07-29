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
  const storedId =
    typeof window !== 'undefined'
      ? window.localStorage.getItem('adhok_active_user')
      : null;
  const hasFetchedOnce = useRef(false);

  const fetchSession = useCallback(
    async (opts?: { userId?: string }) => {
      try {
        const headers: Record<string, string> = {};
        const url = '/api/session';
        const override = opts?.userId ?? storedId ?? undefined;
        if (override) headers['adhok_active_user'] = override;
        const res = await fetch(url, { headers });
        if (!res.ok) throw new Error('no session');
        const { user } = await res.json();
        if (!user) {
          console.warn('[AuthProvider] Session resolved as null');
          if (!storedId || opts?.userId) {
            setState((s) => ({ ...s, loading: false, refreshSession: fetchSession }));
          }
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
    },
    [storedId]
  );

  useEffect(() => {
    if (hasFetchedOnce.current) return;
    hasFetchedOnce.current = true;
    fetchSession();
  }, [fetchSession]);

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
}
