'use client';
import { SignUp } from '@clerk/nextjs';

interface TalentSignUpFormProps {
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export function TalentSignUpForm({ loading, setLoading }: TalentSignUpFormProps) {
  void loading;
  void setLoading;
  return (
        <SignUp signInUrl="/sign-in" redirectUrl="/talent/dashboard" />
  );
}
