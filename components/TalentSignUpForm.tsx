'use client';
import { SignUp } from '@clerk/nextjs';

interface TalentSignUpFormProps {
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export function TalentSignUpForm({ loading, setLoading }: TalentSignUpFormProps) {
  void loading;
  void setLoading;
  const isMock = process.env.NEXT_PUBLIC_USE_MOCK === 'true';
  if (isMock) return <p>Mock mode: sign-up hidden</p>;
  return (
        <SignUp signInUrl="/sign-in" redirectUrl="/talent/dashboard" />
  );
}
