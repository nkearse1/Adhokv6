'use client';
import { useEffect, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/client/useAuthContext';

interface NeonUser {
  id: string;
  username: string | null;
  full_name: string | null;
}

export default function NeonUserSwitcher() {
  const [users, setUsers] = useState<NeonUser[]>([]);
  const [value, setValue] = useState('');
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [switching, setSwitching] = useState(false);
  const { authUser, userId, refreshSession } = useAuth();

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;
    async function load() {
      try {
        const res = await fetch('/api/dev/list-users');
        if (res.ok) {
          const data = await res.json();
          setUsers(data.users || []);
        }
      } catch (err) {
        console.error('Failed loading users', err);
      }
    }
    load();
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('adhok_active_user');
      if (stored) setValue(stored);
    }
  }, []);

  const handleChange = async (val: string) => {
    setValue(val);
    setPendingId(val);
    setSwitching(true);
    localStorage.setItem('adhok_active_user', val);
    console.log('[NeonUserSwitcher] set adhok_active_user', val);
    await refreshSession({ userId: val });
    console.log('[NeonUserSwitcher] refreshSession called');
  };

  useEffect(() => {
    if (!switching || !pendingId) return;
    if (userId === pendingId) {
      if (typeof window !== 'undefined') {
        window.location.reload();
      }
    }
  }, [switching, pendingId, userId]);

  if (process.env.NODE_ENV !== 'development') return null;

  return (
    <div className="fixed bottom-4 right-4 bg-white border rounded-lg shadow p-4 z-50">
      <p className="text-sm font-semibold mb-2 text-gray-700">Neon User:</p>
      <Select value={value} onValueChange={handleChange} disabled={switching}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Choose user" />
        </SelectTrigger>
        <SelectContent>
          {users.map((u) => (
            <SelectItem key={u.id} value={u.id}>
              {u.username || u.full_name || u.id}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {switching && (
        <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
          <Loader2 className="h-3 w-3 animate-spin" /> Updating session...
        </div>
      )}
      {authUser && (
        <p
          className="text-xs text-gray-500 mt-2"
          title={`Resolved user: ${authUser.username || authUser.full_name || authUser.id}`}
        >
          Resolved: {authUser.username || authUser.full_name || authUser.id}
        </p>
      )}
    </div>
  );
}
