'use client';
import { SignIn } from '@clerk/nextjs';

export function SignInForm(props: any) {
  return <SignIn redirectUrl="/sign-in-callback" {...props} />;
}

