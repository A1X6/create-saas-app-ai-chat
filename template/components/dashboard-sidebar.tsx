"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import useSWR from "swr";
import {
  LayoutDashboard,
  MessageSquare,
  ChevronRight,
  GalleryVerticalEnd,
  BadgeCheck,
  CreditCard,
  LogOut,
  Sparkles,
  ChevronsUpDown,
  MoreHorizontal,
  Trash2,
} from "lucide-react";
import type { ChatConversation } from "@/lib/db/schema";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuAction,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { signOutAction } from "@/lib/actions/auth-actions";
import { customerPortalAction } from "@/lib/payments/actions";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface DashboardSidebarProps extends React.ComponentProps<typeof Sidebar> {
  conversations: ChatConversation[];
  user?: {
    name: string;
    email: string;
    avatar?: string;
    planName?: string | null;
    subscriptionStatus?: string | null;
  };
}

// Fetcher function for SWR
const fetcher = (url: string) => fetch(url).then(res => res.json());

// ConversationsList component to handle pagination
function ConversationsList({ initialConversations }: { initialConversations: ChatConversation[] }) {
  const [showAll, setShowAll] = React.useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [conversationToDelete, setConversationToDelete] = React.useState<string | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [openDropdownId, setOpenDropdownId] = React.useState<string | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentConversationId = searchParams.get('conversation');

  // Use SWR for real-time conversation list updates
  const { data, mutate } = useSWR(
    '/api/conversations',
    fetcher,
    {
      fallbackData: { conversations: initialConversations },
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      dedupingInterval: 2000,
    }
  );

  const conversations = data?.conversations || initialConversations;

  const displayedConversations = showAll
    ? conversations
    : conversations.slice(0, 10);

  const hasMore = conversations.length > 10;

  const handleDeleteClick = (conversationId: string) => {
    setConversationToDelete(conversationId);
    setOpenDropdownId(null); // Close the dropdown
    setDeleteDialogOpen(true); // Open the alert dialog
  };

  const handleDeleteConfirm = async () => {
    if (!conversationToDelete) return;

    setIsDeleting(true);
    try {
      // Optimistic update - remove from UI immediately
      const optimisticData = {
        conversations: conversations.filter((c: ChatConversation) => c.id !== conversationToDelete)
      };
      mutate(optimisticData, false);

      // Perform the actual deletion
      const { deleteConversationAction } = await import('@/lib/actions/conversation-actions');
      const result = await deleteConversationAction(conversationToDelete);

      if (result.success) {
        toast.success('Conversation deleted');

        // If deleted conversation was active, redirect to new chat
        if (currentConversationId === conversationToDelete) {
          router.push('/dashboard/chat');
        }

        // Revalidate to ensure sync with server
        mutate();
      } else {
        toast.error(result.message);
        // Rollback optimistic update on error
        mutate();
      }
    } catch {
      toast.error('Failed to delete conversation');
      // Rollback optimistic update on error
      mutate();
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setConversationToDelete(null);
    }
  };

  return (
    <>
      <SidebarMenuSub>
        {/* New Conversation Button */}
        <SidebarMenuSubItem>
          <SidebarMenuSubButton asChild isActive={!currentConversationId}>
            <Link href="/dashboard/chat" className="text-primary">
              <span className="truncate">+ New Conversation</span>
            </Link>
          </SidebarMenuSubButton>
        </SidebarMenuSubItem>

        {/* Existing Conversations */}
        {displayedConversations.map((conversation: ChatConversation) => (
          <SidebarMenuSubItem key={conversation.id} className="group/item relative">
            <SidebarMenuSubButton asChild isActive={currentConversationId === conversation.id}>
              <Link href={`/dashboard/chat?conversation=${conversation.id}`} className="pr-8">
                <span className="truncate">{conversation.title}</span>
              </Link>
            </SidebarMenuSubButton>

            {/* Delete Dropdown Menu */}
            <DropdownMenu
              open={openDropdownId === conversation.id}
              onOpenChange={(open) => setOpenDropdownId(open ? conversation.id : null)}
            >
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 opacity-0 group-hover/item:opacity-100 transition-opacity"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">More options</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => handleDeleteClick(conversation.id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuSubItem>
        ))}

        {/* Show More/Less Button */}
        {hasMore && (
          <SidebarMenuSubItem>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start h-8 px-2 text-xs"
              onClick={() => setShowAll(!showAll)}
            >
              {showAll ? 'Show Less' : `Show More (${conversations.length - 10} more)`}
            </Button>
          </SidebarMenuSubItem>
        )}
      </SidebarMenuSub>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this conversation
              and all its messages.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export function DashboardSidebar({ conversations, user, ...props }: DashboardSidebarProps) {
  const pathname = usePathname();
  const { isMobile } = useSidebar();

  const navItems = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Overview" },
  ];

  const isAIActive = pathname.startsWith("/dashboard/chat");

  // Check if user has active or trialing subscription
  const hasActiveSubscription =
    user?.subscriptionStatus === 'active' ||
    user?.subscriptionStatus === 'trialing';

  // Show upgrade if user doesn't have active/trialing subscription
  const showUpgrade = !hasActiveSubscription;

  const handleLogout = async () => {
    await signOutAction();
  };

  const handleBillingPortal = async () => {
    await customerPortalAction();
  };

  return (
    <Sidebar
      className="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
      {...props}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <GalleryVerticalEnd className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Dashboard</span>
                  <span className="truncate text-xs">SaaS App</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarMenu>
            {/* Regular nav items */}
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild tooltip={item.label} isActive={isActive}>
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}

            {/* AI Chat with Conversations Dropdown */}
            <Collapsible asChild defaultOpen={isAIActive}>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="AI Service" isActive={isAIActive}>
                  <Link href="/dashboard/chat">
                    <MessageSquare />
                    <span>AI Service</span>
                  </Link>
                </SidebarMenuButton>
                <CollapsibleTrigger asChild>
                  <SidebarMenuAction className="data-[state=open]:rotate-90">
                    <ChevronRight />
                    <span className="sr-only">Toggle conversations</span>
                  </SidebarMenuAction>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <ConversationsList initialConversations={conversations} />
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {/* User Footer */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={user?.avatar} alt={user?.name} />
                    <AvatarFallback className="rounded-lg">
                      {user?.name?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{user?.name || "User"}</span>
                    <span className="truncate text-xs">{user?.email || ""}</span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage src={user?.avatar} alt={user?.name} />
                      <AvatarFallback className="rounded-lg">
                        {user?.name?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-medium">{user?.name || "User"}</span>
                      <span className="truncate text-xs">{user?.email || ""}</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {showUpgrade && (
                  <>
                    <DropdownMenuGroup>
                      <DropdownMenuItem>
                        <Sparkles />
                        Upgrade Plan
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                  </>
                )}
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/account">
                      <BadgeCheck />
                      Account
                    </Link>
                  </DropdownMenuItem>
                  {hasActiveSubscription && (
                    <DropdownMenuItem onClick={handleBillingPortal}>
                      <CreditCard />
                      Billing
                    </DropdownMenuItem>
                  )}
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
