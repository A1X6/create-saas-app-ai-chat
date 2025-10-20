'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import useSWR, { mutate as globalMutate } from 'swr';
import { Send, Loader2, Sparkles, User as UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { OrbLazy } from '@/components/ui/orb-lazy';
import { ShimmeringText } from '@/components/ui/shimmering-text';
import { Conversation, ConversationContent, ConversationEmptyState } from '@/components/ui/conversation';
import { Response } from '@/components/ui/response';
import { sendChatAction } from '@/lib/actions/chat-actions';
import { toast } from 'sonner';
import { AI_MODELS, FREE_MODELS, getDefaultModel, type AIModel } from '@/lib/ai/models';
import { formatHex, oklch } from 'culori';

interface MessageType {
  role: 'user' | 'assistant';
  content: string;
}

interface DbMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatbotProps {
  user: {
    id: string;
    email: string;
    name: string | null;
    subscriptionStatus: string | null;
    aiCreditsBalance: number;
    aiCreditsAllocated: number;
    aiCreditsUsed: number;
    freeTokensUsed: number;
    freeTokensLimit: number;
  };
  conversationId: string | null;
}

// Fetcher function for SWR
const fetcher = (url: string) => fetch(url).then(res => res.json());

export function ChatbotElevenLabs({ user, conversationId }: ChatbotProps) {
  const router = useRouter();
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<AIModel>(getDefaultModel());
  const [orbColors, setOrbColors] = useState<[string, string]>(['#CADCFC', '#A0B9D1']);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(conversationId);
  const lastLoadedConversationId = useRef<string | null>(null);
  const [isNewConversationStreaming, setIsNewConversationStreaming] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);

  // Use SWR for conversation data fetching
  const { data: conversationData, isLoading: isLoadingConversation, error } = useSWR(
    conversationId ? `/api/conversations/${conversationId}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 2000, // Prevent duplicate requests within 2 seconds
    }
  );

  // Calculate credits usage percentage
  const creditsUsagePercentage = user.aiCreditsAllocated > 0
    ? (user.aiCreditsUsed / user.aiCreditsAllocated) * 100
    : 0;

  // Get orb colors from CSS variables
  useEffect(() => {
    const getColors = () => {
      const style = getComputedStyle(document.documentElement);
      const primaryValue = style.getPropertyValue('--primary').trim();
      const accentValue = style.getPropertyValue('--accent').trim();

      // Convert oklch to hex
      let primaryHex = '#CADCFC'; // Fallback
      let accentHex = '#A0B9D1'; // Fallback

      if (primaryValue) {
        try {
          const primaryColor = oklch(primaryValue);
          if (primaryColor) {
            primaryHex = formatHex(primaryColor);
          }
        } catch (e) {
          console.warn('Failed to convert primary color:', e);
        }
      }

      if (accentValue) {
        try {
          const accentColor = oklch(accentValue);
          if (accentColor) {
            accentHex = formatHex(accentColor);
          }
        } catch (e) {
          console.warn('Failed to convert accent color:', e);
        }
      }

      setOrbColors([primaryHex, accentHex]);
    };

    getColors();

    // Listen for theme changes
    const observer = new MutationObserver(getColors);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  // Sync conversation data from SWR to local state
  // Only load messages when switching to a different conversation
  useEffect(() => {
    setCurrentConversationId(conversationId);

    // Check if we're switching to a different conversation
    const isSwitchingConversation = conversationId !== lastLoadedConversationId.current;

    if (!conversationId) {
      // New chat - clear messages
      setMessages([]);
      lastLoadedConversationId.current = null;
      setIsNewConversationStreaming(false);
      setIsStreaming(false);
    } else if (isSwitchingConversation && conversationData?.messages && !isStreaming) {
      // Only load from server when switching conversations AND not currently streaming
      // This prevents overwriting the streaming message with the full message
      const loadedMessages = conversationData.messages.map((msg: DbMessage) => ({
        role: msg.role,
        content: msg.content,
      }));
      setMessages(loadedMessages);
      lastLoadedConversationId.current = conversationId;
      // Reset streaming flags when switching conversations
      setIsNewConversationStreaming(false);
      setIsStreaming(false);
    }
  }, [conversationId, conversationData, isStreaming]);

  // Handle SWR errors
  useEffect(() => {
    if (error) {
      console.error('Failed to load conversation:', error);
      toast.error('Failed to load conversation');
    }
  }, [error]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!input.trim() || isLoading || isStreaming) return;

    const userMessage = input.trim();
    setInput('');
    setIsLoading(true);

    // Add user message to UI
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);

    try {
      // Prepare form data
      const formData = new FormData();
      formData.append('message', userMessage);
      formData.append('history', JSON.stringify(messages));
      formData.append('model', selectedModel.id);

      // Include conversationId if continuing a conversation
      if (currentConversationId) {
        formData.append('conversationId', currentConversationId);
      }

      // Send chat message
      const result = await sendChatAction(formData);

      if (!result.success) {
        toast.error(result.message);
        // Remove user message on error
        setMessages((prev) => prev.slice(0, -1));
        setIsLoading(false);
        setIsNewConversationStreaming(false);
        setIsStreaming(false);
      } else {
        // Stop loading immediately when response is received
        setIsLoading(false);

        // If new conversation, update URL with conversation ID
        const isNewConversation = !currentConversationId;
        if (isNewConversation && result.conversationId) {
          // Mark that we're streaming a new conversation
          setIsNewConversationStreaming(true);

          setCurrentConversationId(result.conversationId);
          router.push(`/dashboard/chat?conversation=${result.conversationId}`, { scroll: false });

          // Revalidate conversations list in sidebar
          globalMutate('/api/conversations');
        }

        // Mark that we're streaming (prevents loading messages from SWR)
        setIsStreaming(true);

        // Add empty assistant message that will be streamed
        setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

        // Stream the response letter by letter
        const fullMessage = result.message;
        let currentIndex = 0;

        const streamInterval = setInterval(() => {
          if (currentIndex < fullMessage.length) {
            const chunk = fullMessage.slice(0, currentIndex + 1);
            setMessages((prev) => {
              const newMessages = [...prev];
              newMessages[newMessages.length - 1] = {
                role: 'assistant',
                content: chunk,
              };
              return newMessages;
            });
            currentIndex++;
          } else {
            clearInterval(streamInterval);
            // Streaming complete
            setIsNewConversationStreaming(false);
            setIsStreaming(false);
          }
        }, 20); // 20ms per character for smooth streaming
      }
    } catch (error) {
      console.error('Chat error:', error);
      toast.error('Failed to send message');
      // Remove user message on error
      setMessages((prev) => prev.slice(0, -1));
      setIsLoading(false);
      setIsNewConversationStreaming(false);
      setIsStreaming(false);
    }
  }

  // Check subscription status
  const isTrialing = user.subscriptionStatus === 'trialing';
  const hasActiveSubscription = user.subscriptionStatus === 'active';
  const isUnsubscribed = !user.subscriptionStatus || (!isTrialing && !hasActiveSubscription);

  const freeTokensPercentage = user.freeTokensLimit > 0
    ? (user.freeTokensUsed / user.freeTokensLimit) * 100
    : 0;

  // Filter models based on subscription status
  // Only ACTIVE paid subscribers can use paid models (they have AI credits)
  // Trial users can only use free models (unlimited)
  // Unsubscribed users can only use free models (with token limits)
  const availableModels = hasActiveSubscription ? AI_MODELS : FREE_MODELS;

  // Ensure selected model is available for user's subscription
  // If user doesn't have active subscription and selected model is paid, switch to free model
  useEffect(() => {
    if (!hasActiveSubscription && selectedModel.type === 'paid') {
      const freeModel = FREE_MODELS[0] || AI_MODELS[0];
      setSelectedModel(freeModel);

      if (isTrialing) {
        toast.info('Trial users can only use free models. Upgrade to a paid plan to access paid models with AI credits.');
      } else {
        toast.info('Subscribe to a paid plan to access paid models with AI credits.');
      }
    }
  }, [hasActiveSubscription, isTrialing, selectedModel]);

  return (
    <div className="flex flex-col h-full gap-4">
      {/* AI Credits Alert for Active Paid Subscribers */}
      {hasActiveSubscription && user.aiCreditsAllocated > 0 && (
        <Alert>
          <Sparkles className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>AI Credits Used</span>
                <span className="font-medium">
                  ${user.aiCreditsUsed.toFixed(2)} / ${user.aiCreditsAllocated.toFixed(2)}
                </span>
              </div>
              <Progress value={creditsUsagePercentage} className="h-2" />
              <p className="text-xs text-muted-foreground">
                Free models: unlimited • Paid models: use credits
              </p>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Trial Users Alert */}
      {isTrialing && (
        <Alert>
          <Sparkles className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-2">
              <p className="text-sm font-medium">Trial Period - Free Models Only</p>
              <p className="text-xs text-muted-foreground">
                Unlimited access to free models. Upgrade to a paid plan to unlock paid models with AI credits.
              </p>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Free Tokens Alert for Unsubscribed Users */}
      {isUnsubscribed && (
        <Alert>
          <Sparkles className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Free Tokens Used</span>
                <span className="font-medium">
                  {freeTokensPercentage.toFixed(1)}%
                </span>
              </div>
              <Progress value={freeTokensPercentage} className="h-2" />
              <p className="text-xs text-muted-foreground">
                Free tier: limited to free models only. Subscribe to get unlimited access.
              </p>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Model Selector */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium">AI Model:</label>
            <Select
              value={selectedModel.id}
              onValueChange={(value) => {
                const model = availableModels.find((m) => m.id === value);
                if (model) setSelectedModel(model);
              }}
            >
              <SelectTrigger className="w-[280px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {availableModels.map((model) => (
                  <SelectItem key={model.id} value={model.id}>
                    {model.name} {model.type === 'free' && '(Free)'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Messages Area */}
      <Card className="flex-1 flex flex-col overflow-hidden">
        <Conversation className="flex-1">
          <ConversationContent className="space-y-6">
            {/* Loading Conversation State - Skip if streaming new conversation */}
            {isLoadingConversation && !isNewConversationStreaming && (
              <div className="flex flex-col items-center justify-center h-full gap-4">
                <div className="w-[80px] h-[80px]">
                  <OrbLazy colors={orbColors} agentState="thinking" />
                </div>
                <ShimmeringText
                  text="Loading conversation..."
                  className="text-lg"
                />
              </div>
            )}

            {/* Empty State */}
            {!isLoadingConversation && messages.length === 0 && !isLoading && !isNewConversationStreaming && (
              <ConversationEmptyState
                icon={<div className="w-[120px] h-[120px]"><OrbLazy colors={orbColors} /></div>}
                title={
                  <ShimmeringText
                    text="How can I help you today?"
                    className="text-2xl font-bold"
                  />
                }
                description={`I'm powered by ${selectedModel.name}. Ask me anything about anything!`}
              />
            )}

            {/* Messages - Show even if loading when streaming new conversation */}
            {(!isLoadingConversation || isNewConversationStreaming) && messages.map((message, index) => (
              <div
                key={index}
                className={`flex gap-3 ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.role === 'assistant' && (
                  <div className="flex-shrink-0 w-10 h-10">
                    <OrbLazy colors={orbColors} />
                  </div>
                )}

                {message.role === 'user' ? (
                  <Card className="max-w-[80%] h-fit">
                    <CardContent>
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="max-w-[80%]">
                    <Response>{message.content}</Response>
                  </div>
                )}

                {message.role === 'user' && (
                  <Avatar className="flex-shrink-0 h-10 w-10">
                    <AvatarFallback>
                      <UserIcon className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}

            {(!isLoadingConversation || isNewConversationStreaming) && isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="flex-shrink-0 w-10 h-10">
                  <OrbLazy colors={orbColors} agentState="thinking" />
                </div>
                <div>
                  <ShimmeringText text="Thinking..." />
                </div>
              </div>
            )}
          </ConversationContent>
        </Conversation>

        {/* Input Area */}
        <div className="p-4 border-t">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="min-h-[60px] resize-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              disabled={isLoading || isStreaming}
            />
            <Button
              type="submit"
              size="icon"
              disabled={isLoading || isStreaming || !input.trim()}
              className="h-[60px] w-[60px]"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
