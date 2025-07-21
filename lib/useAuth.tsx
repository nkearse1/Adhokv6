'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';

// Authentication checks are bypassed in mock mode, but the user objects
// returned here are real records queried from the database

export type TestRole = 'admin' | 'client' | 'talent';

const FALLBACK_USER = {
  id: '00000000-0000-0000-0000-000000000001',
  username: 'mock_talent',
  userRole: 'talent',
};

async function fetchTestUser(role: TestRole) {
  try {
    const res = await fetch(`/api/test-user?role=${role}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.user ?? null;
  } catch (err) {
    console.error('fetchTestUser error', err);
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
    async function loadTestUser(role: TestRole) {
      let userObj = await fetchTestUser(role);
      if (userObj) {
        // userObj is an actual user row from the database
        // even though the login process is mocked
        console.log('Using test user', {
          id: userObj.id,
          role: userObj.userRole,
          name: userObj.username,
        });
        setState({
          userId: userObj.id,
          username: userObj.username || userObj.id,
          userRole: userObj.userRole as UserRole,
          isAdmin: userObj.userRole === 'admin',
          isAuthenticated: true,
          loading: false,
          authUser: null,
          setDevRole: (r) => {
            localStorage.setItem('dev_user_role', r);
            window.location.reload();
          },
        });
      } else {
        console.warn(`No test user found for role ${role}, using fallback`);
        userObj = FALLBACK_USER;
        setState({
          userId: userObj.id,
          username: userObj.username,
          userRole: userObj.userRole as UserRole,
          isAdmin: false,
          isAuthenticated: true,
          loading: false,
          authUser: null,
          setDevRole: (r) => {
            localStorage.setItem('dev_user_role', r);
            window.location.reload();
          },
        });
      }
    }

    if (isMock) {
      const role =
        (localStorage.getItem('dev_user_role') as TestRole | null) || 'talent';
      loadTestUser(role);
      return;
    }

    if (process.env.NODE_ENV === 'development') {
      const devRole = localStorage.getItem('dev_user_role') as TestRole | null;
      if (devRole) {
        loadTestUser(devRole);
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
