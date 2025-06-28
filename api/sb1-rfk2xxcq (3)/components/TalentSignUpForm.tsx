'use client';
import { SignUp } from '@clerk/nextjs';

export function TalentSignUpForm() {
  return (
        <SignUp signInUrl="/sign-in" redirectUrl="/talent/dashboard" />
  );
}
