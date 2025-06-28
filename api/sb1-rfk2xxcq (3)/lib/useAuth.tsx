'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import type { UserResource } from '@clerk/types';

type UserRole = 'admin' | 'client' | 'talent' | null;

interface AuthState {
  authUser: UserResource | null;
  userId: string | null;
  userRole: UserRole;
  username: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
}

const defaultAuthState: AuthState = {
  authUser: null,
  userId: null,
  userRole: null,
  username: null,
  isAuthenticated: false,
  isAdmin: false,
  loading: true,
};

const AuthContext = createContext<AuthState>(defaultAuthState);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<AuthState>(defaultAuthState);
  const { user, isSignedIn, isLoaded } = useUser();

  useEffect(() => {
    if (isLoaded) {
      if (isSignedIn && user) {
        const role = (user.publicMetadata?.user_role as UserRole) || 'talent';
        const username =
          user.username ??
          user.emailAddresses?.[0]?.emailAddress?.split('@')[0] ??
          user.id;

        setState({
          authUser: user,
          userId: user.id,
          userRole: role,
          username,
          isAuthenticated: true,
          isAdmin: role === 'admin',
          loading: false,
        });
      } else {
        setState({ ...defaultAuthState, loading: false });
      }
    }
  }, [isLoaded, isSignedIn, user]);

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
};
