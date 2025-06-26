// useChatMessages.ts
import { useState, useEffect } from 'react';
import { supabase } from '@supabase/supabaseClient';

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
    async function loadMessages() {
      if (!projectId) return;
      const { data, error } = await supabase
        .from('project_messages')
        .select('id, sender_role, text, created_at, deliverable_id')
        .eq('project_id', projectId)
        .order('created_at', { ascending: true });

      if (!error && data) {
        setMessages(
          data.map((m) => ({
            id: m.id,
            sender: m.sender_role,
            text: m.text,
            timestamp: new Date(m.created_at),
            deliverableId: m.deliverable_id,
          }))
        );
      } else if (error) {
        console.error('Error loading messages', error);
      }
    }
    loadMessages();
  }, [projectId]);

  const sendMessage = async (text: string, deliverableId?: string) => {
    if (!projectId) return;
    const { data, error } = await supabase
      .from('project_messages')
      .insert({
        project_id: projectId,
        text,
        deliverable_id: deliverableId,
      })
      .select()
      .single();

    if (!error && data) {
      const newMessage: ChatMessage = {
        id: data.id,
        text: data.text,
        sender: data.sender_role,
        timestamp: new Date(data.created_at),
        deliverableId: data.deliverable_id,
      };
      setMessages((prev) => [...prev, newMessage]);
    } else if (error) {
      console.error('Error sending message', error);
    }
  };

  return { messages, setMessages, sendMessage, isTyping };
}
