'use client';

import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';

export default function HeaderClerk() {
  return (
    <header className="w-full px-4 py-2 border-b flex items-center justify-between">
      <div className="font-semibold">Adhok</div>
      <div>
        <SignedIn>
          <UserButton />
        </SignedIn>
        <SignedOut>
          <SignInButton />
        </SignedOut>
      </div>
    </header>
  );
}
