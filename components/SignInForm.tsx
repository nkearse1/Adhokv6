'use client';
import { SignIn } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function SignInForm(props: any) {
  const router = useRouter();

  return <SignIn redirectUrl="/sign-in-callback" {...props} />;
}

