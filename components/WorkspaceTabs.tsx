'use client';
import { useState } from 'react';

export default function WorkspaceTabs() {
  const [tab, setTab] = useState<'chat' | 'deliverables' | 'payment' | 'activity'>('chat');

  return (
    <div className="mb-4">
      <div className="flex gap-2 mb-2">
        {['chat', 'deliverables', 'payment', 'activity'].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t as any)}
            className={`px-3 py-1 text-sm border rounded ${tab === t ? 'bg-[#2E3A8C] text-white' : ''}`}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>
      <div className="p-4 border rounded text-sm bg-gray-50">Current tab: {tab}</div>
    </div>
  );
}

