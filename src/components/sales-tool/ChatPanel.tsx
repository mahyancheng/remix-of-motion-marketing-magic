import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Square, Trash2, Bot, User, Link, Paperclip, Loader2, X, FileText, Image as ImageIcon, File } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { ChatMessage } from '@/types/proposal';

interface ChatPanelProps {
  messages: ChatMessage[];
  isLoading: boolean;
  statusMessage?: string;
  onSendMessage: (message: string, files?: File[]) => void;
  onStopGeneration: () => void;
  onClearChat: () => void;
}

const QUICK_PROMPTS = [
  { label: "Start Discovery", prompt: "Let's start a discovery session for a new client." },
  { label: "Calculate Budget", prompt: "Help me calculate the marketing budget for this client." },
  { label: "Suggest Positioning", prompt: "Based on what we know, suggest positioning for this client." },
  { label: "Review Proposal", prompt: "Review the current proposal data and tell me what's missing." },
];

const ACCEPTED_FILE_TYPES = '.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.jpg,.jpeg,.png,.gif,.webp,.txt,.csv';
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const getFileIcon = (type: string) => {
  if (type.startsWith('image/')) return <ImageIcon className="h-4 w-4" />;
  if (type.includes('pdf') || type.includes('document') || type.includes('word')) return <FileText className="h-4 w-4" />;
  return <File className="h-4 w-4" />;
};

const ChatPanel = ({
  messages,
  isLoading,
  statusMessage,
  onSendMessage,
  onStopGeneration,
  onClearChat,
}: ChatPanelProps) => {
  const [input, setInput] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, statusMessage]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((!input.trim() && selectedFiles.length === 0) || isLoading) return;
    
    const messageText = input.trim() || (selectedFiles.length > 0 
      ? `Please analyze these ${selectedFiles.length} file(s): ${selectedFiles.map(f => f.name).join(', ')}`
      : '');
    
    onSendMessage(messageText, selectedFiles.length > 0 ? selectedFiles : undefined);
    setInput('');
    setSelectedFiles([]);
  };

  const handleQuickPrompt = (prompt: string) => {
    if (isLoading) return;
    onSendMessage(prompt);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => {
      if (file.size > MAX_FILE_SIZE) {
        alert(`File "${file.name}" is too large. Max size is 10MB.`);
        return false;
      }
      return true;
    });
    setSelectedFiles(prev => [...prev, ...validFiles].slice(0, 5)); // Max 5 files
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUrlPaste = () => {
    const url = prompt("Enter website URL to analyze:");
    if (url) {
      onSendMessage(`Please browse and analyze this website: ${url}`);
    }
  };

  return (
    <div className="flex h-full flex-col bg-card">
      {/* Header - fixed at top */}
      <div className="flex-shrink-0 flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg accent-gradient">
            <Bot className="h-4 w-4 text-accent-foreground" />
          </div>
          <div>
            <h2 className="font-display font-semibold text-foreground">Sales Assistant</h2>
            <p className="text-xs text-muted-foreground">AI Agent • Supports files</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleUrlPaste}
            title="Browse Website"
            className="text-muted-foreground hover:text-foreground"
          >
            <Link className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearChat}
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Messages - scrollable area */}
      <div className="flex-1 overflow-y-auto p-4 min-h-0">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/10">
              <Bot className="h-8 w-8 text-accent" />
            </div>
            <h3 className="mb-2 font-display font-semibold text-foreground">
              Start a Discovery Session
            </h3>
            <p className="mb-6 max-w-sm text-sm text-muted-foreground">
              I'll help you gather client information and create a professional proposal.
              Upload files (PDF, docs, images) or paste website URLs for analysis!
            </p>
            
            {/* Quick prompts */}
            <div className="grid grid-cols-2 gap-2 w-full max-w-sm">
              {QUICK_PROMPTS.map((qp, idx) => (
                <Button
                  key={idx}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickPrompt(qp.prompt)}
                  className="text-xs"
                >
                  {qp.label}
                </Button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div
                  className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'accent-gradient text-accent-foreground'
                  }`}
                >
                  {message.role === 'user' ? (
                    <User className="h-4 w-4" />
                  ) : (
                    <Bot className="h-4 w-4" />
                  )}
                </div>
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground'
                  }`}
                >
                  {message.role === 'assistant' ? (
                    <div className="prose prose-sm max-w-none dark:prose-invert">
                      <ReactMarkdown>{message.content || '...'}</ReactMarkdown>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm">{message.content}</p>
                      {message.attachments && message.attachments.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {message.attachments.map((att, idx) => (
                            <span 
                              key={idx} 
                              className="inline-flex items-center gap-1 rounded bg-primary-foreground/20 px-2 py-0.5 text-xs"
                            >
                              {getFileIcon(att.type)}
                              {att.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg accent-gradient text-accent-foreground">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="rounded-2xl bg-secondary px-4 py-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>{statusMessage || 'Thinking...'}</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input - fixed at bottom */}
      <form onSubmit={handleSubmit} className="flex-shrink-0 border-t border-border p-4 bg-card">
        {/* Selected files preview */}
        {selectedFiles.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {selectedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center gap-2 rounded-lg bg-secondary px-3 py-1.5 text-sm"
              >
                {getFileIcon(file.type)}
                <span className="max-w-[120px] truncate">{file.name}</span>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
        
        <div className="flex gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPTED_FILE_TYPES}
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading || selectedFiles.length >= 5}
            title="Attach files (PDF, docs, images)"
          >
            <Paperclip className="h-4 w-4" />
          </Button>
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={selectedFiles.length > 0 ? "Add a message about these files..." : "Type your message or paste a URL..."}
            disabled={isLoading}
            className="flex-1"
          />
          {isLoading ? (
            <Button type="button" variant="destructive" size="icon" onClick={onStopGeneration}>
              <Square className="h-4 w-4" />
            </Button>
          ) : (
            <Button type="submit" variant="accent" size="icon" disabled={!input.trim() && selectedFiles.length === 0}>
              <Send className="h-4 w-4" />
            </Button>
          )}
        </div>
        <p className="mt-2 text-xs text-muted-foreground text-center">
          Tip: Upload PDFs, docs, images or paste URLs for analysis
        </p>
      </form>
    </div>
  );
};

export default ChatPanel;
