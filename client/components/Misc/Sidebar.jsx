"use client";
import React, { useState, useEffect } from "react";
import { AI_SERVER_URL } from "@/constants/utils.js";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Logo } from "@/public/images";
import { ChevronLeft, ChevronRight, MessageSquare, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useGlobalState } from "@/context/GlobalContext";
import { UserButton, useUser } from "@clerk/nextjs";

export default function Sidebar({ onToggle }) {
  const [chatList, setChatList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { sidebarState, setSidebarState } = useGlobalState();
  const { user } = useUser();
  const router = useRouter();
  const { lang } = useParams();

  useEffect(() => {
    const fetchChatHistory = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const response = await fetch(
          `${AI_SERVER_URL}/chat-history?user_id=${user?.username}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch chat history");
        }

        const data = await response.json();
        console.log("AI history:", data.chats);

        // Create chat list with slugified IDs for the URL and store original titles
        const transformedChats = data.chats.map((chat) => ({
          id: chat.title.replace(/\s+/g, "-").toLowerCase(), // This is for the URL
          title: chat.title, // Original title for display and querying
        }));

        setChatList(transformedChats);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching chat history:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchChatHistory();
  }, [user]);

  const toggleSidebar = () => {
    setSidebarState(!sidebarState);
    if (onToggle) {
      onToggle(sidebarState);
    }
  };

  const startNewChat = () => {
    router.push(`/${lang}/chat`);
  };

  // Function to create URLs with the title as a query parameter
  const createChatUrl = (chat) => {
    return `/${lang}/chat/${chat.id}?title=${encodeURIComponent(chat.title)}`;
  };

  return (
    <div
      className={`bg-white border-r border-primary-200 transition-all duration-300 flex flex-col h-full  ${
        sidebarState
          ? "w-64 max-lg:absolute max-lg:left-0 max-lg:top-0 max-lg:z-100"
          : "w-18 "
      }`}
    >
      {/* Header with toggle button */}
      <div
        className="flex items-center justify-between p-4 border-b border-primary-200"
        id="step1"
      >
        {sidebarState ? (
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 relative">
              <Image
                src={Logo}
                alt="Asha.AI Logo"
                className="h-10 w-auto mb-5 tour-logo"
              />
            </div>
            <span className="text-primary-900 font-semibold">Asha.AI</span>
          </div>
        ) : (
          <div className="w-full flex justify-center">
            <div className="w-8 h-8 relative">
              <Image
                src={Logo}
                alt="Asha.AI Logo"
                className="h-8 w-auto mb-5 tour-logo"
              />
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleSidebar}
          className="text-primary-700 hover:bg-primary-100"
        >
          {sidebarState ? (
            <ChevronLeft size={18} />
          ) : (
            <ChevronRight size={18} />
          )}
        </Button>
      </div>

      {/* New Chat Button */}
      <div className="p-2 border-b border-primary-100">
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={startNewChat}
                className={`w-full ${
                  sidebarState
                    ? "justify-start gap-2 px-3"
                    : "justify-center px-2"
                } bg-primary-700 hover:bg-primary-800 text-white`}
                id="amigo"
              >
                <Plus size={18} />
                {sidebarState && "New Chat"}
              </Button>
            </TooltipTrigger>
            {!sidebarState && (
              <TooltipContent side="right">New Chat</TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Chat history list */}
      <div className="flex-1 overflow-y-auto py-2">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <p className="text-primary-500 text-sm">Loading chats...</p>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-full">
            <p className="text-red-500 text-sm">Error loading chats</p>
          </div>
        ) : sidebarState ? (
          <div className="px-2">
            <h3 className="text-sm font-medium text-primary-900 px-3 py-2">
              Recent Chats
            </h3>
            <div className="space-y-1">
              {chatList.length > 0 ? (
                chatList.map((chat) => (
                  <Link href={createChatUrl(chat)} key={chat.id}>
                    <Button
                      variant="ghost"
                      className="w-full justify-start pl-6 pr-2 py-2 h-auto text-left hover:bg-primary-100 text-primary-800"
                    >
                      <MessageSquare
                        size={14}
                        className="text-primary-500 mr-2"
                      />
                      <span className="text-sm truncate">{chat.title}</span>
                    </Button>
                  </Link>
                ))
              ) : (
                <p className="text-primary-500 text-sm px-4 py-2">
                  No chat history found
                </p>
              )}
            </div>
          </div>
        ) : (
          // Collapsed state icons
          <div className="flex flex-col items-center pt-2">
            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-10 h-10 p-0 mb-2 text-primary-700 hover:bg-primary-100"
                  >
                    <MessageSquare size={20} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">Chat History</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
      </div>

      {/* User profile section */}
      <div className="border-t border-primary-200 p-4">
        <div
          className={`flex ${
            sidebarState ? "justify-start" : "justify-center"
          } items-center px-2`}
        >
          <UserButton
            afterSignOutUrl="/en"
            appearance={{
              elements: {
                userButtonAvatarBox: { height: "32px", width: "32px" },
              },
            }}
          />

          {sidebarState && (
            <div className="flex flex-col justify-center items-start ml-3">
              <h1 className="text-primary-900 font-semibold text-sm">
                {user?.fullName || user?.username || "User"}
              </h1>
              <h3 className="text-[0.75rem] text-primary-500 -mt-0.5 font-medium">
                {user?.primaryEmailAddress?.emailAddress || "User email"}
              </h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
