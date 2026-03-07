'use client';
import { SignUp } from '@clerk/nextjs';
import { useEffect } from 'react';

interface TalentSignUpFormProps {
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  roleIntent?: string | null;
}

export function TalentSignUpForm({ loading, setLoading, roleIntent }: TalentSignUpFormProps) {
  void loading;
  void setLoading;

  useEffect(() => {
    if (roleIntent && typeof window !== 'undefined') {
      window.localStorage.setItem('signup_role_intent', roleIntent);
    }
  }, [roleIntent]);

  const redirectUrl = roleIntent === 'talent' ? '/talent/dashboard' : undefined;

  return <SignUp signInUrl="/sign-in" redirectUrl={redirectUrl} />;
}
