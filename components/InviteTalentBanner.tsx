'use client';

import { Button } from '@/components/ui/button';

interface InviteTalentBannerProps {
  onInvite?: () => void;
}

export default function InviteTalentBanner({ onInvite }: InviteTalentBannerProps) {
  return (
    <div className="bg-blue-50 border rounded-md p-4 flex items-center justify-between">
      <p className="text-sm">Need more proposals? Invite top talent to your briefs.</p>
      <Button onClick={onInvite}>Invite Talent</Button>
    </div>
  );
}
