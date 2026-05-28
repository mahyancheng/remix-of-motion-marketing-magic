import { useState, useCallback, useRef } from 'react';
import { ChatMessage, ChatAttachment, ProposalData } from '@/types/proposal';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/sales-chat`;

export function useSalesChat(
  proposalData: ProposalData,
  onProposalUpdate: (updates: Partial<ProposalData>) => void
) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const abortControllerRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(async (input: string, files?: File[]) => {
    // Convert files to base64 attachments if provided
    let attachments: ChatAttachment[] | undefined;
    if (files && files.length > 0) {
      attachments = await Promise.all(
        files.map(async (file) => {
          const base64 = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
              const result = reader.result as string;
              const base64Data = result.split(',')[1];
              resolve(base64Data);
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });
          return {
            name: file.name,
            type: file.type,
            size: file.size,
            base64,
          };
        })
      );
    }

    const userMsg: ChatMessage = { 
      role: 'user', 
      content: input,
      attachments,
    };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setIsLoading(true);
    setStatusMessage('Thinking...');

    abortControllerRef.current = new AbortController();

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const accessToken = session?.access_token || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
      const resp = await fetch(CHAT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        },
        body: JSON.stringify({ 
          messages: updatedMessages,
          proposalContext: proposalData 
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!resp.ok) {
        const errorData = await resp.json().catch(() => ({}));
        throw new Error(errorData.error || `Request failed with status ${resp.status}`);
      }

      // Handle streaming response
      if (!resp.body) {
        throw new Error('No response body');
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let finalContent = '';
      const proposalUpdates: Partial<ProposalData>[] = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (!line.trim() || line.startsWith(':')) continue;
          if (!line.startsWith('data: ')) continue;

          const data = line.slice(6).trim();
          if (data === '[DONE]') continue;

          try {
            const parsed = JSON.parse(data);
            
            // Handle status updates
            if (parsed.type === 'status') {
              setStatusMessage(parsed.message);
            }
            // Handle proposal updates
            else if (parsed.type === 'proposal_update') {
              proposalUpdates.push(parsed.data);
            }
            // Handle final content
            else if (parsed.type === 'content') {
              finalContent = parsed.content;
            }
            // Handle errors
            else if (parsed.error) {
              throw new Error(parsed.error);
            }
          } catch (e) {
            // Ignore parse errors for incomplete chunks
            if (e instanceof SyntaxError) continue;
            throw e;
          }
        }
      }

      // Process any remaining buffer
      if (buffer.trim() && buffer.startsWith('data: ')) {
        const data = buffer.slice(6).trim();
        if (data !== '[DONE]') {
          try {
            const parsed = JSON.parse(data);
            if (parsed.type === 'content') {
              finalContent = parsed.content;
            } else if (parsed.type === 'proposal_update') {
              proposalUpdates.push(parsed.data);
            }
          } catch {
            // Ignore
          }
        }
      }

      // Add assistant message
      if (finalContent) {
        const assistantMsg: ChatMessage = { role: 'assistant', content: finalContent };
        setMessages(prev => [...prev, assistantMsg]);
      }

      // Apply any proposal updates from tool calls
      if (proposalUpdates.length > 0) {
        const mergedUpdates = proposalUpdates.reduce((acc, update) => {
          const cleanUpdate = Object.fromEntries(
            Object.entries(update).filter(([_, v]) => v !== undefined)
          );
          return { ...acc, ...cleanUpdate };
        }, {} as Partial<ProposalData>);

        if (Object.keys(mergedUpdates).length > 0) {
          onProposalUpdate(mergedUpdates);
          toast({
            title: 'Proposal Updated',
            description: `Updated ${Object.keys(mergedUpdates).length} field(s) based on our conversation.`,
          });
        }
      }

      return finalContent;
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return;
      }
      console.error('Chat error:', error);
      toast({
        variant: 'destructive',
        title: 'Chat Error',
        description: error instanceof Error ? error.message : 'Failed to send message',
      });
    } finally {
      setIsLoading(false);
      setStatusMessage('');
      abortControllerRef.current = null;
    }
  }, [messages, proposalData, onProposalUpdate]);

  const stopGeneration = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  const clearChat = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    isLoading,
    statusMessage,
    sendMessage,
    stopGeneration,
    clearChat,
    setMessages,
  };
}
