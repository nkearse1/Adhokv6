'use client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { toast } from 'sonner';

interface TalentSettingsDialogProps {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  email: string;
}

export function TalentSettingsDialog({ open, onOpenChange, email }: TalentSettingsDialogProps) {
  const [notifications, setNotifications] = useState(true);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      // stub action
      await new Promise((r) => setTimeout(r, 300));
      toast.success('Settings saved');
      onOpenChange(false);
    } catch {
      toast.error('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md space-y-4">
        <DialogHeader>
          <DialogTitle>Profile Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          <p>Email: {email}</p>
          <label className="flex items-center gap-2 text-sm">
            <Switch checked={notifications} onCheckedChange={setNotifications} />
            Enable notifications
          </label>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
