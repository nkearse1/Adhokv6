// This file contains utility functions for talent qualification

export function applyAutoQualification(talent: any) {
  const invited = talent.joinMethod === 'invited';
  const hasKeywords = talent.bio?.toLowerCase().includes('seo') || talent.expertise?.toLowerCase().includes('seo');

  const newHistoryEntry = {
    reason: invited ? 'invited' : hasKeywords ? 'resume_match' : 'manual',
    timestamp: new Date().toISOString(),
  };

  return {
    ...talent,
    isQualified: invited || hasKeywords,
    qualificationReason: newHistoryEntry.reason,
    qualificationHistory: [...(talent.qualificationHistory || []), newHistoryEntry],
  };
}

export function validateCSVHeaders(headers: string[]) {
  const required = ['fullName', 'email', 'expertise'];
  const missing = required.filter((h) => !headers.includes(h));
  return missing;
}

export function parseCSVData(text: string) {
  const lines = text.split('\n').filter(Boolean);
  const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());
  const missing = validateCSVHeaders(headers);
  if (missing.length) throw new Error(`Missing columns: ${missing.join(', ')}`);

  return lines.slice(1).map((line) => {
    const values = line.split(',').map((v) => v.trim());
    const record: Record<string, string> = {};
    headers.forEach((h, i) => (record[h] = values[i] || ''));
    return record;
  });
}

export function getUpdatedTalentsWithQualification(talents: any[], shouldQualify: boolean) {
  return talents.map((talent) => {
    const reason = 'manual';
    const historyEntry = {
      reason,
      timestamp: new Date().toISOString(),
    };
    return {
      ...talent,
      isQualified: shouldQualify,
      qualificationReason: reason,
      qualificationHistory: [...(talent.qualificationHistory || []), historyEntry],
    };
  });
}