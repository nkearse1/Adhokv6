'use client';

import React, { useEffect } from 'react';

export default function ResetPasswordPage() {
  useEffect(() => {
    window.location.href = 'https://adhokpro.clerk.accounts.dev/forgot-password';
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="max-w-md w-full space-y-6 text-center">
        <div className="flex justify-center items-center gap-2 mb-2">
          <div className="h-8 w-8 text-[#2E3A8C] font-bold text-2xl">💼</div>
          <h1 className="text-3xl font-bold text-[#2F2F2F]">Adhok</h1>
        </div>
        <p className="text-sm text-[#00A499] font-medium">Redirecting to password reset...</p>
      </div>
    </main>
  );
}
