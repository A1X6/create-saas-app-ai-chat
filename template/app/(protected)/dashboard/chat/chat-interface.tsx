"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import useSWR, { mutate as globalMutate } from "swr";
import { Send, Loader2, Sparkles, User as UserIcon } from "lucide-react";
import {
  ArtifactCard,
  ArtifactCardSkeleton,
} from "@/app/(protected)/dashboard/chat/artifact-card";
import { ArtifactDrawer } from "@/app/(protected)/dashboard/chat/artifact-drawer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { OrbLazy } from "@/components/ui/orb-lazy";
import { ShimmeringText } from "@/components/ui/shimmering-text";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
} from "@/components/ui/conversation";
import { Response } from "@/components/ui/response";
import { sendChatAction } from "@/lib/actions/chat-actions";
import { toast } from "sonner";
import { AI_MODELS, getDefaultModel, type AIModel } from "@/lib/ai/models";
import { formatHex, oklch } from "culori";
import { cn } from "@/lib/utils";
import { useIsDesktop } from "@/hooks/use-is-desktop";

interface MessageType {
  role: "user" | "assistant";
  content: string;
  isArtifact?: boolean;
  messageId?: string; // ID of the message (for artifacts)
}

interface DbMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  isArtifact?: boolean;
  createdAt: Date;
  updatedAt: Date;
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
  };
  conversationId: string | null;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function ChatbotElevenLabs({ user, conversationId }: ChatbotProps) {
  const router = useRouter();
  const isDesktop = useIsDesktop(); // Detect screen size for responsive rendering
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [selectedModel, setSelectedModel] =
    useState<AIModel>(getDefaultModel());
  const [orbColors, setOrbColors] = useState<[string, string]>([
    "#CADCFC",
    "#A0B9D1",
  ]);
  const [isTransitioning, setIsTransitioning] = useState(false); // Track conversation transitions

  // Track conversation state
  const activeConversationId = useRef<string | null>(conversationId);
  const streamIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const fullMessageRef = useRef<string>(""); // Store full message for streaming

  // Artifact state
  const [artifactDrawerOpen, setArtifactDrawerOpen] = useState(false);
  const [currentArtifact, setCurrentArtifact] = useState<{
    id: string;
    title: string;
    content: string;
    updatedAt: Date;
  } | null>(null);
  const [artifacts, setArtifacts] = useState<
    Map<string, { id: string; title: string; content: string; updatedAt: Date }>
  >(new Map());

  // Fetch conversation data - don't fetch while streaming or for temp IDs
  const isTempId = conversationId?.startsWith("temp-");
  const shouldFetch = conversationId && !isTempId && !isStreaming;

  const { data: conversationData, isLoading: isLoadingConversation } = useSWR(
    shouldFetch ? `/api/conversations/${conversationId}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 2000,
    }
  );

  // Calculate credits and subscription status
  const creditsUsagePercentage =
    user.aiCreditsAllocated > 0
      ? (user.aiCreditsUsed / user.aiCreditsAllocated) * 100
      : 0;

  const isTrialing = user.subscriptionStatus === "trialing";
  const hasActiveSubscription = user.subscriptionStatus === "active";
  const isUnsubscribed =
    !user.subscriptionStatus || (!isTrialing && !hasActiveSubscription);
  const availableModels = AI_MODELS; // All users can access all models (all are paid)

  // Get orb colors from CSS variables
  useEffect(() => {
    const getColors = () => {
      const style = getComputedStyle(document.documentElement);
      const primaryValue = style.getPropertyValue("--primary").trim();
      const accentValue = style.getPropertyValue("--accent").trim();

      let primaryHex = "#CADCFC";
      let accentHex = "#A0B9D1";

      if (primaryValue) {
        try {
          const primaryColor = oklch(primaryValue);
          if (primaryColor) primaryHex = formatHex(primaryColor);
        } catch (e) {
          console.warn("Failed to convert primary color:", e);
        }
      }

      if (accentValue) {
        try {
          const accentColor = oklch(accentValue);
          if (accentColor) accentHex = formatHex(accentColor);
        } catch (e) {
          console.warn("Failed to convert accent color:", e);
        }
      }

      setOrbColors([primaryHex, accentHex]);
    };

    getColors();
    const observer = new MutationObserver(getColors);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  // Handle conversation changes - IMMEDIATE cleanup of streaming
  useEffect(() => {
    // Conversation changed - stop streaming and complete the message if needed
    if (conversationId !== activeConversationId.current) {
      // If streaming, complete the message immediately
      if (streamIntervalRef.current && fullMessageRef.current) {
        clearInterval(streamIntervalRef.current);
        streamIntervalRef.current = null;

        // Show full message immediately
        setMessages((prev) => {
          const newMessages = [...prev];
          if (
            newMessages.length > 0 &&
            newMessages[newMessages.length - 1].role === "assistant"
          ) {
            newMessages[newMessages.length - 1] = {
              role: "assistant",
              content: fullMessageRef.current,
            };
          }
          return newMessages;
        });

        setIsStreaming(false);
        fullMessageRef.current = "";
      }

      // Close artifact panel when switching conversations
      setArtifactDrawerOpen(false);
      setCurrentArtifact(null);

      // Update active conversation
      activeConversationId.current = conversationId;

      // Clear messages immediately when changing to ANY conversation (except temp IDs)
      if (!isTempId) {
        setMessages([]);

        // Set transitioning only for real conversations that need loading
        if (conversationId) {
          setIsTransitioning(true);
        } else {
          setIsTransitioning(false); // New chat, no loading needed
        }
      }
    }
  }, [conversationId, isTempId]);

  // Load messages when conversation data is available
  useEffect(() => {
    // Load messages from server for real conversations when data arrives
    if (
      conversationId &&
      !isTempId &&
      conversationData?.messages &&
      conversationId === activeConversationId.current
    ) {
      const loadedMessages = conversationData.messages.map(
        (msg: DbMessage) => ({
          role: msg.role,
          content: msg.content,
          isArtifact: msg.isArtifact,
          messageId: msg.id,
        })
      );
      setMessages(loadedMessages);
      setIsTransitioning(false); // Done loading

      // Extract artifacts directly from messages
      const artifactMessages = conversationData.messages.filter(
        (msg: DbMessage) => msg.isArtifact && msg.role === "assistant"
      );

      if (artifactMessages.length > 0) {
        const newArtifacts = new Map<
          string,
          { id: string; title: string; content: string; updatedAt: Date }
        >(
          artifactMessages.map((msg: DbMessage) => {
            // Extract title from first non-empty line
            const title =
              msg.content
                .split("\n")
                .find((l: string) => l.trim())
                ?.trim()
                .substring(0, 100) || "Untitled Artifact";

            return [
              msg.id,
              {
                id: msg.id,
                title,
                content: msg.content,
                updatedAt: new Date(msg.createdAt),
              },
            ];
          })
        );
        setArtifacts(newArtifacts);
      }
    }
  }, [conversationData, conversationId, isTempId]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamIntervalRef.current) {
        clearInterval(streamIntervalRef.current);
        streamIntervalRef.current = null;
      }
    };
  }, []);

  // All models are now paid - no model switching needed

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!input.trim() || isLoading || isStreaming) return;

    const userMessage = input.trim();
    setInput("");
    setIsLoading(true);

    // Check if new conversation
    const isNewConversation = !conversationId;
    let tempId: string | null = null;

    // FIX 1: Change URL BEFORE adding messages to prevent flickering
    if (isNewConversation) {
      tempId = `temp-${Date.now()}`;
      activeConversationId.current = tempId;
      router.push(`/dashboard/chat?conversation=${tempId}`, { scroll: false });
    }

    // Add user message immediately AFTER URL change
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);

    try {
      // Prepare request
      const formData = new FormData();
      formData.append("message", userMessage);
      formData.append("history", JSON.stringify(messages));
      formData.append("model", selectedModel.id);

      // Only include real conversation IDs
      if (conversationId && !conversationId.startsWith("temp-")) {
        formData.append("conversationId", conversationId);
      }

      // Send to server
      const result = await sendChatAction(formData);

      if (!result.success) {
        toast.error(result.message);
        setMessages((prev) => prev.slice(0, -1));
        setIsLoading(false);

        // Go back to clean chat on error
        if (isNewConversation) {
          activeConversationId.current = null;
          router.replace("/dashboard/chat", { scroll: false });
        }
        return;
      }

      setIsLoading(false);

      // Update to real conversation ID
      if (isNewConversation && result.conversationId) {
        activeConversationId.current = result.conversationId;
        router.replace(
          `/dashboard/chat?conversation=${result.conversationId}`,
          { scroll: false }
        );
        globalMutate("/api/conversations");
      }

      // Handle artifact response (AI-detected artifact)
      if (result.isArtifact && result.messageId && result.artifactTitle) {
        // Add message with artifact metadata
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: result.message,
            isArtifact: true,
            messageId: result.messageId,
          },
        ]);

        // Store artifact data
        const artifact = {
          id: result.messageId,
          title: result.artifactTitle,
          content: result.message,
          updatedAt: new Date(),
        };
        setArtifacts((prev) => new Map(prev).set(result.messageId, artifact));

        // Do NOT auto-open - user must click the artifact card manually

        return;
      }

      // Stream normal message
      setIsStreaming(true);
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      // Clear any existing interval
      if (streamIntervalRef.current) {
        clearInterval(streamIntervalRef.current);
      }

      const fullMessage = result.message;
      fullMessageRef.current = fullMessage; // Store for interruption handling
      let currentIndex = 0;

      streamIntervalRef.current = setInterval(() => {
        if (currentIndex < fullMessage.length) {
          const chunk = fullMessage.slice(0, currentIndex + 1);
          setMessages((prev) => {
            const newMessages = [...prev];
            newMessages[newMessages.length - 1] = {
              role: "assistant",
              content: chunk,
            };
            return newMessages;
          });
          currentIndex++;
        } else {
          // Streaming complete
          if (streamIntervalRef.current) {
            clearInterval(streamIntervalRef.current);
            streamIntervalRef.current = null;
          }
          setIsStreaming(false);
          fullMessageRef.current = "";
        }
      }, 20);
    } catch (error) {
      console.error("Chat error:", error);
      toast.error("Failed to send message");
      setMessages((prev) => prev.slice(0, -1));
      setIsLoading(false);
      setIsStreaming(false);

      if (isNewConversation) {
        activeConversationId.current = null;
        router.replace("/dashboard/chat", { scroll: false });
      }
    }
  }

  // Artifact handlers
  function handleOpenArtifact(artifactId: string) {
    const artifact = artifacts.get(artifactId);
    if (artifact) {
      setCurrentArtifact(artifact);
      setArtifactDrawerOpen(true);
    }
  }

  // Better display logic - prioritize messages over loading states
  const hasMessages = messages.length > 0;
  const showLoading =
    (isLoadingConversation || isTransitioning) &&
    !isStreaming &&
    !hasMessages &&
    !isTempId &&
    !isLoading;
  const showEmpty =
    !hasMessages &&
    !isLoading &&
    !isStreaming &&
    !isTempId &&
    !isLoadingConversation &&
    !isTransitioning;

  return (
    <div className="flex flex-col h-full gap-4">
      {/* AI Credits Usage - Show for both trial and paid users */}
      {(hasActiveSubscription || isTrialing) && user.aiCreditsAllocated > 0 && (
        <Alert>
          <Sparkles className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>AI Credits Used</span>
                <span className="font-medium">
                  {creditsUsagePercentage.toFixed(1)}%
                </span>
              </div>
              <Progress value={creditsUsagePercentage} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {isTrialing
                  ? "Trial credit - All AI models available. Upgrade for full plan credits."
                  : "All AI models use credits based on actual usage cost."}
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
                    {model.name} {model.type === "free" && "(Free)"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Area - Split view on desktop, full width on mobile */}
      <div className="flex-1 flex gap-4 overflow-hidden">
        {/* Chat Area - 50% on desktop when artifact is open, 100% otherwise or on mobile */}
        <div
          className={cn(
            "flex flex-col overflow-hidden transition-all",
            artifactDrawerOpen && isDesktop ? "w-1/2" : "w-full"
          )}
        >
          {/* Messages Area */}
          <Card className="flex-1 flex flex-col overflow-hidden">
            <Conversation className="flex-1">
              <ConversationContent className="space-y-6">
                {/* Loading State - only show if truly loading and no messages */}
                {showLoading && (
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

                {/* Empty State - only show when truly empty */}
                {showEmpty && (
                  <ConversationEmptyState
                    icon={
                      <div className="w-[120px] h-[120px]">
                        <OrbLazy colors={orbColors} />
                      </div>
                    }
                    title={
                      <ShimmeringText
                        text="How can I help you today?"
                        className="text-2xl font-bold"
                      />
                    }
                    description={`I'm powered by ${selectedModel.name}. Ask me anything!`}
                  />
                )}

                {/* Messages */}
                {hasMessages &&
                  messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex gap-3 ${
                        message.role === "user"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      {message.role === "assistant" && (
                        <div className="flex-shrink-0 w-10 h-10">
                          <OrbLazy colors={orbColors} />
                        </div>
                      )}

                      {message.role === "user" ? (
                        <Card className="max-w-[80%] h-fit">
                          <CardContent>
                            <p className="text-sm whitespace-pre-wrap">
                              {message.content}
                            </p>
                          </CardContent>
                        </Card>
                      ) : message.isArtifact && message.messageId ? (
                        /* Artifact Card - compact UI for AI-detected prompts */
                        artifacts.get(message.messageId) ? (
                          <ArtifactCard
                            title={artifacts.get(message.messageId)!.title}
                            onOpen={() =>
                              handleOpenArtifact(message.messageId!)
                            }
                          />
                        ) : (
                          /* Show skeleton while artifact data is loading */
                          <ArtifactCardSkeleton />
                        )
                      ) : (
                        <div className="max-w-[80%]">
                          <Response>{message.content}</Response>
                        </div>
                      )}

                      {message.role === "user" && (
                        <Avatar className="flex-shrink-0 h-10 w-10">
                          <AvatarFallback>
                            <UserIcon className="h-5 w-5" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  ))}

                {/* Thinking indicator - only show when actively sending message */}
                {isLoading && !isLoadingConversation && (
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
                    if (e.key === "Enter" && !e.shiftKey) {
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

        {/* Artifact Panel - 50% on desktop (only when open and on desktop screen) */}
        {artifactDrawerOpen && currentArtifact && isDesktop && (
          <div className="flex w-1/2 overflow-hidden">
            <ArtifactDrawer
              open={artifactDrawerOpen}
              onOpenChange={setArtifactDrawerOpen}
              artifact={currentArtifact}
              mode="panel"
            />
          </div>
        )}

        {/* Artifact Drawer - Mobile only (overlay, only when NOT desktop) */}
        {artifactDrawerOpen && currentArtifact && !isDesktop && (
          <ArtifactDrawer
            open={artifactDrawerOpen}
            onOpenChange={setArtifactDrawerOpen}
            artifact={currentArtifact}
            mode="drawer"
          />
        )}
      </div>
    </div>
  );
}
