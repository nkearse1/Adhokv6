'use client';
import ExperienceBadge from '@/components/ExperienceBadge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Profile {
  fullName?: string;
  username?: string;
  email?: string;
  expertise?: string;
  location?: string;
  experienceBadge?: string;
  linkedinUrl?: string;
}

interface Props {
  profile: Profile | null;
  onEdit?: () => void;
  onSettings?: () => void;
}

export default function ProfilePanel({ profile, onEdit, onSettings }: Props) {
  if (!profile) return null;

  const displayName = profile.fullName || profile.username;

  return (
    <Card className="space-y-3">
      <CardContent className="p-4 space-y-2">
        <h2 className="text-lg font-semibold text-[#2E3A8C]">Profile</h2>
        {displayName && <p className="font-medium">{displayName}</p>}
        {profile.email && <p className="text-sm text-gray-600">{profile.email}</p>}
        {profile.expertise && (
          <p className="text-sm text-gray-600">{profile.expertise}</p>
        )}
        {profile.experienceBadge && (
          <ExperienceBadge badge={profile.experienceBadge} />
        )}
        {profile.location && (
          <p className="text-sm text-gray-600">📍 {profile.location}</p>
        )}
        {profile.linkedinUrl && (
          <a
            href={profile.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-[#2E3A8C] underline"
          >
            LinkedIn
          </a>
        )}
        <div className="flex gap-2 pt-2">
          <Button size="sm" onClick={onEdit}>Edit Profile</Button>
          <Button size="sm" variant="secondary" onClick={onSettings}>
            Profile Settings
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
