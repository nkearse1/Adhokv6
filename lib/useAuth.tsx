'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';

type UserRole = 'admin' | 'client' | 'talent';

interface AuthState {
  userId: string | null;
  username: string | null;
  userRole: UserRole;
  isAdmin: boolean;
  loading: boolean;
  isAuthenticated: boolean;
  setDevRole: (role: UserRole) => void;
}

const defaultAuthState: AuthState = {
  userId: null,
  username: null,
  userRole: 'talent',
  isAdmin: false,
  loading: true,
  isAuthenticated: false,
  setDevRole: () => {},
};

const AuthContext = createContext<AuthState>(defaultAuthState);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, isSignedIn, isLoaded } = useUser();
  const [state, setState] = useState(defaultAuthState);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const devRole = localStorage.getItem('devUserRole') as UserRole | null;

      if (devRole) {
        const mockUsers: Record<UserRole, Partial<AuthState>> = {
          admin: {
            userId: 'admin-000',
            username: 'admin_demo',
            userRole: 'admin',
            isAdmin: true,
          },
          client: {
            userId: 'client-001',
            username: 'client_demo',
            userRole: 'client',
            isAdmin: false,
          },
          talent: {
            userId: 'talent-001',
            username: 'talent_demo',
            userRole: 'talent',
            isAdmin: false,
          },
        };

        const mock = mockUsers[devRole];
        setState({
          userId: mock.userId || null,
          username: mock.username || null,
          userRole: mock.userRole || 'talent',
          isAdmin: mock.isAdmin || false,
          isAuthenticated: true,
          loading: false,
          setDevRole: (role) => {
            localStorage.setItem('devUserRole', role);
            window.location.reload();
          },
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
          setDevRole: () => {},
        });
      } else {
        setState({ ...defaultAuthState, loading: false });
      }
    }
  }, [isLoaded, isSignedIn, user]);

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
};
