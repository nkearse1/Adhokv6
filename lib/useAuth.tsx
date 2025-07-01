'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';

type UserRole = 'admin' | 'client' | 'talent';

interface AuthState {
  userId: string | null;
  username: string | null;
  userRole: UserRole;
  isAdmin: boolean;
  isAuthenticated: boolean;
  loading: boolean;
  setDevRole: (role: UserRole) => void;
}

const defaultAuthState: AuthState = {
  userId: null,
  username: null,
  userRole: 'talent',
  isAdmin: false,
  isAuthenticated: false,
  loading: true,
  setDevRole: () => {},
};

const AuthContext = createContext<AuthState>(defaultAuthState);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, isSignedIn, isLoaded } = useUser();
  const [state, setState] = useState<AuthState>(defaultAuthState);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const devRole = localStorage.getItem('dev_user_role') as UserRole | null;

      if (devRole) {
        const mockUsers: Record<UserRole, Partial<AuthState>> = {
          admin: {
            userId: 'mock-admin',
            username: 'admin_demo',
            userRole: 'admin',
            isAdmin: true,
          },
          client: {
            userId: 'mock-client',
            username: 'client_demo',
            userRole: 'client',
            isAdmin: false,
          },
          talent: {
            userId: 'mock-talent',
            username: 'talent_demo',
            userRole: 'talent',
            isAdmin: false,
          },
        };

        const mock = mockUsers[devRole];
        setState({
          ...defaultAuthState,
          ...mock,
          isAuthenticated: true,
          loading: false,
          setDevRole,
        });
        return;
      }
    }

    if (isLoaded) {
      if (isSignedIn && user) {
        const role = (user.publicMetadata?.role as UserRole) || 'talent';
        setState({
          userId: user.id,
          username: user.username || user.id,
          userRole: role,
          isAdmin: role === 'admin',
          isAuthenticated: true,
          loading: false,
          setDevRole,
        });
      } else {
        setState({ ...defaultAuthState, loading: false, setDevRole });
      }
    }
  }, [isLoaded, isSignedIn, user]);

  const setDevRole = (role: UserRole) => {
    localStorage.setItem('dev_user_role', role);
    window.location.reload();
  };

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
};
