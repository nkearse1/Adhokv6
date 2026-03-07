// useChatMessages.ts
import { useState, useEffect } from 'react';

export interface ChatMessage {
  id: string;
  sender: 'talent' | 'client';
  text: string;
  timestamp: Date;
  deliverableId?: string;
}

export function useChatMessages(projectId?: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const load = async () => {
      const res = await fetch('/api/db?table=project_messages');
      const json = await res.json();
      const data = (json.data || []).filter((m: any) => m.projectId === projectId);
      setMessages(data);
    };
    if (projectId) void load();
  }, [projectId]);

  const sendMessage = async (text: string, deliverableId?: string) => {
    if (!projectId || !text.trim()) return;

    const res = await fetch('/api/db', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        table: 'project_messages',
        data: { projectId, text, deliverableId, senderRole: 'talent' }
      })
    });
    if (!res.ok) return;
    const json = await res.json();
    setMessages(prev => [...prev, json.data[0]]);
  };

  return { messages, setMessages, sendMessage, isTyping };
}
