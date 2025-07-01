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
  const [devRole, setDevRole] = useState<UserRole | null>(null);
  const [state, setState] = useState(defaultAuthState);

  useEffect(() => {
    if (!isLoaded) return;

    const actualRole = (user?.publicMetadata?.role as UserRole) || 'talent';
    const role = devRole || actualRole;

    setState({
      userId: user?.id || null,
      username: user?.username || null,
      userRole: role,
      isAdmin: role === 'admin',
      isAuthenticated: !!user,
      loading: false,
      setDevRole,
    });
  }, [isLoaded, isSignedIn, user, devRole]);

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
};
