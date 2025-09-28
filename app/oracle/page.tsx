'use client';

import { FormEvent, useCallback, useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { MemoryMap, type MemoryNode } from '@/components/app/oracle/memory-map';
import {
  ArrowUp,
  Paperclip,
  Loader2,
  Sparkles,
  MessageCircle,
  Brain,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface ModelOption {
  id: string;
  label: string;
  subtitle: string;
  tagline: string;
}

const MODEL_OPTIONS: ModelOption[] = [
  {
    id: 'oracle-pro',
    label: 'Oracle Pro',
    subtitle: 'Gemma-3n-e2b · 5B parameters',
    tagline: 'Best for deep analysis and long-form reasoning.',
  },
  {
    id: 'oracle',
    label: 'Oracle',
    subtitle: 'Gemma-3 · 270M parameters',
    tagline: 'Balanced responses with lightweight footprint.',
  },
  {
    id: 'oracle-flash',
    label: 'Oracle Flash',
    subtitle: 'Qwen3-1.7B-Base',
    tagline: 'Fastest replies for quick ideation.',
  },
];

const SUGGESTIONS = [
  'Generate a roadmap for learning machine learning at LIACS.',
  'Summarise the key differences between BFS and DFS.',
  'Create an interactive workshop outline for prospective students.',
  'Explain why Radix Sort can outperform comparison sorts.',
];

const MODEL_DETAILS: Record<string, ModelOption> = MODEL_OPTIONS.reduce(
  (acc, option) => ({ ...acc, [option.id]: option }),
  {}
);

const summaryFromMessage = (message: ChatMessage): string => {
  const trimmed = message.content.trim();
  if (!trimmed) return 'Empty thought';
  return trimmed.length > 64 ? `${trimmed.slice(0, 61)}…` : trimmed;
};

export default function OraclePage() {
  const [model, setModel] = useState<string>(MODEL_OPTIONS[0].id);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [memoryNodes, setMemoryNodes] = useState<MemoryNode[]>([]);
  const [memoryOpen, setMemoryOpen] = useState(false);
  const scrollAnchorRef = useRef<HTMLDivElement>(null);

  const selectedModel = MODEL_DETAILS[model];

  const appendMemoryNode = useCallback((message: ChatMessage) => {
    setMemoryNodes((prev) => {
      const next: MemoryNode[] = [
        ...prev,
        {
          id: message.id,
          role: message.role,
          label: message.role === 'user' ? 'You' : 'Oracle',
          summary: summaryFromMessage(message),
          strength: 1,
        },
      ];
      return next.slice(-20); // cap nodes
    });
  }, []);

  const decayMemory = useCallback(() => {
    setMemoryNodes((prev) =>
      prev
        .map((node) => ({ ...node, strength: Math.max(0, node.strength * 0.92) }))
        .filter((node) => node.strength > 0.1)
    );
  }, []);

  useEffect(() => {
    const timer = setInterval(decayMemory, 3500);
    return () => clearInterval(timer);
  }, [decayMemory]);

  const scrollToBottom = () => {
    scrollAnchorRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const addMessage = useCallback(
    (message: ChatMessage) => {
      setMessages((prev) => [...prev, message]);
      appendMemoryNode(message);
      requestAnimationFrame(scrollToBottom);
    },
    [appendMemoryNode]
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isThinking) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: trimmed,
    };

    addMessage(userMessage);
    setInput('');
    setIsThinking(true);

    setTimeout(() => {
      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: `Oracle (${selectedModel.label}) placeholder response. This chat UI is ready to connect to ${selectedModel.subtitle}.`,
      };
      addMessage(assistantMessage);
      setIsThinking(false);
    }, 850);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
  };

  return (
    <div className="container mx-auto max-w-6xl space-y-8 px-4 py-12">
      <header className="flex flex-col gap-2 text-left">
        <div className="inline-flex items-center gap-2 text-leiden">
          <Sparkles className="h-5 w-5" />
          <span className="text-sm font-semibold uppercase tracking-wide">Oracle Intelligence Console</span>
        </div>
        <h1 className="text-4xl font-semibold text-leiden">Hello there!</h1>
        <p className="text-lg text-muted-foreground">How can I help you today?</p>
      </header>

      <div className="flex flex-wrap gap-2">
        {SUGGESTIONS.map((suggestion) => (
          <Button
            key={suggestion}
            type="button"
            variant="outline"
            size="sm"
            className="rounded-full border-dashed border-leiden/40 text-sm text-leiden hover:bg-leiden/10"
            onClick={() => handleSuggestionClick(suggestion)}
          >
            {suggestion}
          </Button>
        ))}
      </div>

      <Card className="relative overflow-hidden border border-leiden/20 bg-gradient-to-b from-white via-white to-slate-50">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-xl font-semibold text-leiden">Conversation</CardTitle>
            <p className="text-sm text-muted-foreground">
              Messages stay local during the demo. Hook into Hugging Face Inference to enable live completions.
            </p>
          </div>

          <TooltipProvider>
            <Dialog open={memoryOpen} onOpenChange={setMemoryOpen}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="gap-2 text-leiden">
                      <Brain className="h-4 w-4" />
                      Memory map
                    </Button>
                  </DialogTrigger>
                </TooltipTrigger>
                <TooltipContent side="left">Visualise the evolving context</TooltipContent>
              </Tooltip>
              <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Oracle memory graph</DialogTitle>
                  <DialogDescription>
                    Nodes glow brighter when the conversation references similar ideas. They gently fade as context becomes less relevant.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex justify-center">
                  <MemoryMap nodes={memoryNodes} />
                </div>
              </DialogContent>
            </Dialog>
          </TooltipProvider>
        </CardHeader>

        <CardContent className="flex h-[520px] flex-col">
          <div className="flex-1 space-y-4 overflow-y-auto px-4 pb-4 pt-2">
            {messages.length === 0 && (
              <div className="flex h-full flex-col items-center justify-center gap-3 text-center text-muted-foreground">
                <MessageCircle className="h-8 w-8 text-leiden" />
                <p className="max-w-sm text-sm">
                  Ask for study tips, algorithm explanations, or campus guidance. Model responses appear here when connected.
                </p>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={cn('flex w-full', message.role === 'user' ? 'justify-end' : 'justify-start')}
              >
                <div
                  className={cn(
                    'max-w-[70%] rounded-3xl px-4 py-3 text-sm leading-relaxed shadow-sm transition',
                    message.role === 'user'
                      ? 'bg-leiden text-white'
                      : 'bg-white text-slate-800 ring-1 ring-inset ring-leiden/10'
                  )}
                >
                  {message.content}
                </div>
              </div>
            ))}

            {isThinking && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Oracle is composing a response…
              </div>
            )}

            <div ref={scrollAnchorRef} />
          </div>

          <form onSubmit={handleSubmit} className="mt-auto border-t border-leiden/20 bg-white/80 px-4 py-4 shadow-inner">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="border-leiden/30 text-leiden">
                  {selectedModel.label}
                </Badge>
                <span>{selectedModel.subtitle}</span>
              </div>
              <span>{selectedModel.tagline}</span>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <div className="flex flex-1 items-end gap-2 rounded-2xl border border-leiden/20 bg-white px-3 py-2 shadow-sm">
                <Button type="button" variant="ghost" size="icon" className="text-leiden">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Textarea
                  placeholder="Send a message to Oracle"
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  rows={2}
                  className="flex-1 resize-none border-0 bg-transparent px-0 py-1 focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>

              <div className="flex flex-col gap-2 sm:w-[220px]">
                <Select value={model} onValueChange={setModel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select model" />
                  </SelectTrigger>
                  <SelectContent>
                    {MODEL_OPTIONS.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">{option.label}</p>
                          <p className="text-xs text-muted-foreground">{option.subtitle}</p>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button type="submit" disabled={isThinking || input.trim().length === 0} className="w-full bg-leiden text-white hover:bg-leiden/90">
                  <ArrowUp className="mr-2 h-4 w-4" />
                  Send
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
