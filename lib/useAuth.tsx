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
  authUser: any;
  setDevRole: (role: UserRole) => void;
}

const defaultAuthState: AuthState = {
  userId: null,
  username: null,
  userRole: 'talent',
  isAdmin: false,
  loading: true,
  isAuthenticated: false,
  authUser: null,
  setDevRole: () => {},
};

const AuthContext = createContext<AuthState>(defaultAuthState);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: any = ({ children }: { children: any }) => {
  const { user, isSignedIn, isLoaded } = useUser();
  const [state, setState] = useState(defaultAuthState);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const devRole = localStorage.getItem('dev_user_role') as UserRole | null;

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
          authUser: null,
          setDevRole: (role) => {
            localStorage.setItem('dev_user_role', role);
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
          authUser: user,
          setDevRole: () => {},
        });
      } else {
        setState({ ...defaultAuthState, loading: false });
      }
    }
  }, [isLoaded, isSignedIn, user]);

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
};
