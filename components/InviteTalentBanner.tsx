'use client';
import { Button } from '@/components/ui/button';

export default function InviteTalentBanner() {
  return (
    <div className="p-4 bg-blue-50 border rounded mb-4 flex items-center justify-between">
      <p className="text-sm text-blue-900">Need extra help on a project? Invite talent to bid.</p>
      <Button className="bg-[#2E3A8C] text-white hover:bg-[#1B276F]">Invite Talent</Button>
    </div>
  );
}

