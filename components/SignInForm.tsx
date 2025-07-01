'use client';
import { SignIn } from '@clerk/nextjs';

export function SignInForm() {
  return <SignIn redirectUrl="/dashboard" />;
}

