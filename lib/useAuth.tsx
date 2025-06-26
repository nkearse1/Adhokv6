'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';

type UserRole = 'admin' | 'client' | 'talent' | null;

interface AuthState {
  authUser: any | null;
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

// This is the hook you'll use in your components
export const useAuth = () => useContext(AuthContext);

// This is the provider you'll wrap your app with
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<AuthState>(defaultAuthState);
  const { user, isSignedIn, isLoaded } = useUser();

  useEffect(() => {
    if (isLoaded) {
      if (isSignedIn && user) {
        // Get user role from Clerk metadata
        const role = user.publicMetadata?.role as UserRole || 'talent';
        const username = user.username || user.id;

        setState({
          authUser: user,
          userId: user.id,
          userRole: role,
          username: username,
          isAuthenticated: true,
          isAdmin: role === 'admin',
          loading: false,
        });
      } else {
        setState({
          ...defaultAuthState,
          loading: false,
        });
      }
    }
  }, [isLoaded, isSignedIn, user]);

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
};