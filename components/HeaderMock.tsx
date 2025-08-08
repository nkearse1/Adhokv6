'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

export default function HeaderMock() {
  const router = useRouter();
  const pathname = usePathname();
  const search = useSearchParams();

  const setOverride = useCallback(
    (id: string) => {
      const params = new URLSearchParams(search?.toString());
      if (id) {
        params.set('override', id);
      } else {
        params.delete('override');
      }
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, search]
  );

  return (
    <header className="w-full px-4 py-2 border-b flex items-center gap-8">
      <div className="font-semibold">Adhok (Mock Mode)</div>
      <div className="flex items-center gap-6">
        <button
          className="rounded px-3 py-1 border"
          onClick={() => setOverride('10000000-0000-0000-0000-000000000002')}
          title="Switch to Talent"
        >
          Talent
        </button>
        <button
          className="rounded px-3 py-1 border"
          onClick={() => setOverride('00000000-0000-0000-0000-000000000001')}
          title="Switch to Client"
        >
          Client
        </button>
        <button
          className="rounded px-3 py-1 border"
          onClick={() => setOverride('')}
          title="Clear Override"
        >
          Sign Out
        </button>
      </div>
    </header>
  );
}
