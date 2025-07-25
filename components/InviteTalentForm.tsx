'use client';
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function InviteTalentForm() {
  const [email, setEmail] = useState('');
  const [inviting, setInviting] = useState(false);

  const handleInvite = async () => {
    if (!email) return toast.error('Please enter an email');
    setInviting(true);
    try {
   const res = await fetch('/api/db', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          table: 'talent_profiles',
          data: { email, joinMethod: 'invited', isQualified: false }
        })
      });
      if (!res.ok) throw new Error('Insert failed')
      toast.success(`Invitation sent to ${email}`);
      setEmail('');
    } catch (err) {
      toast.error('Failed to invite talent');
    } finally {
      setInviting(false);
    }
  };

  return (
    <Card className="mt-6">
      <CardContent className="p-4">
        <h2 className="text-lg font-semibold mb-2">Invite New Talent</h2>
        <div className="flex gap-2 items-center">
          <Input
            type="email"
            placeholder="Enter email address"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
            disabled={inviting}
          />
          <Button onClick={handleInvite} disabled={inviting}>
            {inviting ? 'Inviting...' : 'Send Invite'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
