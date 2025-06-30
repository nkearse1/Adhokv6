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
    // Load mock messages when projectId changes
    if (projectId) {
      const mockMessages: ChatMessage[] = [
        {
          id: '1',
          sender: 'client',
          text: 'Hi there! Looking forward to working with you on this project.',
          timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
        },
        {
          id: '2',
          sender: 'talent',
          text: 'Thanks for the opportunity! I\'ve reviewed the brief and I\'m excited to get started.',
          timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        }
      ];
      
      setMessages(mockMessages);
    }
  }, [projectId]);

  const sendMessage = async (text: string, deliverableId?: string) => {
    if (!projectId || !text.trim()) return;
    
    // Create a new message
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'talent', // Assuming the sender is always the talent
      text,
      timestamp: new Date(),
      deliverableId
    };
    
    // Add the new message to the state
    setMessages(prev => [...prev, newMessage]);
    
    // Simulate client response
    setTimeout(() => {
      setIsTyping(true);
      
      setTimeout(() => {
        setIsTyping(false);
        const responseMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          sender: 'client',
          text: 'Thanks for the update! Looking good so far.',
          timestamp: new Date(),
          deliverableId
        };
        setMessages(prev => [...prev, responseMessage]);
      }, 3000);
    }, 1000);
  };

  return { messages, setMessages, sendMessage, isTyping };
}
