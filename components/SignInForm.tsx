'use client';
import { SignIn } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function SignInForm(props: any) {
  const isMock = process.env.NEXT_PUBLIC_USE_MOCK === 'true';
  const router = useRouter();

  useEffect(() => {
    if (isMock) {
      router.replace('/sign-in-callback');
    }
  }, [isMock, router]);

  if (isMock) return <p>Mock mode: sign-in skipped</p>;
  return <SignIn redirectUrl="/sign-in-callback" {...props} />;
}

