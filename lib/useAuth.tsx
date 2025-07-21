'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';

export type MockRole = 'admin' | 'client' | 'talent';

async function fetchMockUser(role: MockRole) {
  try {
    const res = await fetch(`/api/mock-user?role=${role}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.user ?? null;
  } catch (err) {
    console.error('fetchMockUser error', err);
    return null;
  }
}

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

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const isMock = process.env.NEXT_PUBLIC_USE_MOCK === 'true';
  const clerkUser = isMock
    ? { user: null, isSignedIn: false, isLoaded: false }
    : // eslint-disable-next-line react-hooks/rules-of-hooks
      useUser();
  const { user, isSignedIn, isLoaded } = clerkUser;
  const [state, setState] = useState(defaultAuthState);

  useEffect(() => {
    async function loadMock(role: MockRole) {
      const mock = await fetchMockUser(role);
      if (mock) {
        console.log('Using mock user', {
          id: mock.id,
          role: mock.userRole,
          name: mock.username,
        });
        setState({
          userId: mock.id,
          username: mock.username || mock.id,
          userRole: mock.userRole as UserRole,
          isAdmin: mock.userRole === 'admin',
          isAuthenticated: true,
          loading: false,
          authUser: null,
          setDevRole: (r) => {
            localStorage.setItem('dev_user_role', r);
            window.location.reload();
          },
        });
      } else {
        console.error(`No mock user found for role ${role}`);
        setState((s) => ({ ...s, loading: false }));
      }
    }

    if (isMock) {
      const role =
        (localStorage.getItem('dev_user_role') as MockRole | null) || 'talent';
      loadMock(role);
      return;
    }

    if (process.env.NODE_ENV === 'development') {
      const devRole = localStorage.getItem('dev_user_role') as MockRole | null;
      if (devRole) {
        loadMock(devRole);
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
  }, [isLoaded, isSignedIn, user, isMock]);

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
};
