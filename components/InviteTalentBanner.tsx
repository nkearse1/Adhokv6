"use client";
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function InviteTalentBanner() {
  const router = useRouter();
  return (
    <div className="bg-[#F0F9FA] border border-[#B5E3E1] p-4 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
      <div>
        <h3 className="font-semibold">Need more talent?</h3>
        <p className="text-sm text-gray-600">Invite experts to collaborate on your briefs.</p>
      </div>
      <Button onClick={() => router.push('/talent/sign-up')} className="bg-[#00D1C1] text-white hover:bg-[#00b4ab]">
        Invite Talent
      </Button>
    </div>
  );
}
