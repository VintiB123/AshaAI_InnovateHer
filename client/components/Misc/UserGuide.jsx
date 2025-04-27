"use client";

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Search,
  HelpCircle,
  Book,
  MessageSquare,
  Sidebar,
  Globe,
  Shield,
  AlertTriangle,
  History,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const UserGuideContent = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { dict } = useLanguage();

  const guideData = {
    gettingStarted: [
      {
        title: "What is Asha?",
        content:
          "Asha is an AI-powered chatbot designed to help users of the JobsForHer Foundation platform access job listings, community events, sessions, and mentorship programs. Asha can also answer FAQs and provide insights on women empowerment initiatives.",
      },
      {
        title: "How to Access Asha",
        content:
          "You can access Asha through the JobsForHer web portal, mobile app, or supported messaging platforms. Look for the chat icon in the bottom right corner of your screen to start a conversation with Asha.",
      },
      {
        title: "Starting a Conversation",
        content:
          "Simply click on the chat icon and type your question or request in the message box. Asha will respond in real-time with relevant information based on your query.",
      },
      {
        title: "Accessing Chat History",
        content:
          "Your conversation history with Asha is stored for your convenience. You can access previous chats anytime from the sidebar. Click on the sidebar menu and find the 'Chat History' section to view or continue previous conversations.",
      },
    ],
    features: [
      {
        title: "Job Listings Information",
        content:
          "Ask Asha about available job opportunities, filtering options, or specific job requirements. Example: 'Show me remote job opportunities' or 'What tech jobs are available?'",
      },
      {
        title: "Community Events & Sessions",
        content:
          "Get information about upcoming workshops, webinars, and networking events. Example: 'What events are happening this week?' or 'Are there any leadership workshops soon?'",
      },
      {
        title: "Mentorship Programs",
        content:
          "Learn about available mentorship opportunities and how to participate. Example: 'How can I find a mentor?' or 'Tell me about mentorship programs'",
      },
      {
        title: "Women Empowerment Resources",
        content:
          "Access insights on global women career engagement and empowerment initiatives. Example: 'Share some women leadership success stories' or 'What are recent women empowerment initiatives?'",
      },
      {
        title: "Chat History",
        content:
          "Asha saves your conversation history for easy reference. You can revisit previous chats, continue conversations, or reference information you've received before. Access your chat history through the sidebar menu at any time.",
      },
    ],
    troubleshooting: [
      {
        title: "Asha Doesn't Understand My Question",
        content:
          "Try rephrasing your question using simpler language or be more specific about what you're looking for. If Asha still doesn't understand, it will offer alternative options or redirect you to human support.",
      },
      {
        title: "Inaccurate or Outdated Information",
        content:
          "Asha strives to provide the most up-to-date information. If you believe the information provided is inaccurate or outdated, please report it using the feedback option after Asha's response.",
      },
      {
        title: "Session Disconnection",
        content:
          "If your conversation with Asha disconnects unexpectedly, simply restart the chat. Your chat history will still be available in the sidebar, so you can continue your conversation where you left off.",
      },
      {
        title: "Can't Find Chat History",
        content:
          "If you're having trouble locating your chat history, make sure you're on the same device and browser you used previously. Click on the sidebar menu icon, then look for the 'Chat History' or 'Previous Conversations' section.",
      },
    ],
    privacy: [
      {
        title: "What Information Does Asha Collect?",
        content:
          "Asha collects non-personalized session details to provide contextually relevant responses. Your chat history is also stored to provide a seamless experience across sessions.",
      },
      {
        title: "How Is My Conversation Data Used?",
        content:
          "Your conversation data is used to improve Asha's responses and capabilities. It also enables the chat history feature so you can reference previous conversations. All data is handled according to strict privacy and security protocols.",
      },
      {
        title: "Security Measures",
        content:
          "Asha employs data encryption for both storage and transmission, content moderation to ensure safe conversations, and complies with global AI ethics frameworks.",
      },
      {
        title: "Managing Your Chat History",
        content:
          "While your chat history is saved for convenience, you can manage this data. To clear your chat history, look for the 'Clear History' option in the sidebar menu under chat history.",
      },
    ],
  };

  // Filter function for search
  const filterContent = (category) => {
    if (!searchQuery) return guideData[category];

    return guideData[category].filter(
      (item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.content.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  return (
    <div className="py-4">
      {/* Search Bar */}
      <div className="relative max-w-md mx-auto mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-primary-700" />
        </div>
        <Input
          type="text"
          placeholder="Search user guide..."
          className="pl-10 pr-3"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Quick Start Card */}
      <Card className="mb-6 border-primary-300 shadow-md">
        <CardHeader className="bg-primary-100 pb-4">
          <CardTitle className="text-primary-900 flex items-center gap-2 text-lg">
            <HelpCircle className="h-5 w-5" /> Quick Start Guide
          </CardTitle>
          <CardDescription>
            Get started with Asha in just a few steps
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="flex flex-col items-center text-center p-2">
              <div className="bg-primary-200 p-2 rounded-full mb-2">
                <MessageSquare className="h-6 w-6 text-primary-800" />
              </div>
              <h3 className="font-medium text-sm mb-1">Start a Chat</h3>
              <p className="text-xs text-gray-600">
                Click the New Chat icon in the top left
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-2">
              <div className="bg-primary-200 p-2 rounded-full mb-2">
                <Book className="h-6 w-6 text-primary-800" />
              </div>
              <h3 className="font-medium text-sm mb-1">Ask a Question</h3>
              <p className="text-xs text-gray-600">
                Type your query about jobs or events
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-2">
              <div className="bg-primary-200 p-2 rounded-full mb-2">
                <Globe className="h-6 w-6 text-primary-800" />
              </div>
              <h3 className="font-medium text-sm mb-1">Get Answers</h3>
              <p className="text-xs text-gray-600">
                Receive relevant information
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-2">
              <div className="bg-primary-200 p-2 rounded-full mb-2">
                <Sidebar className="h-6 w-6 text-primary-800" />
              </div>
              <h3 className="font-medium text-sm mb-1">Access History</h3>
              <p className="text-xs text-gray-600">
                Find previous chats in the sidebar
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="gettingStarted" className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-4">
          <TabsTrigger
            value="gettingStarted"
            className="data-[state=active]:bg-primary-200 data-[state=active]:text-primary-900"
          >
            Getting Started
          </TabsTrigger>
          <TabsTrigger
            value="features"
            className="data-[state=active]:bg-primary-200 data-[state=active]:text-primary-900"
          >
            Features
          </TabsTrigger>
          <TabsTrigger
            value="troubleshooting"
            className="data-[state=active]:bg-primary-200 data-[state=active]:text-primary-900"
          >
            Troubleshooting
          </TabsTrigger>
          <TabsTrigger
            value="privacy"
            className="data-[state=active]:bg-primary-200 data-[state=active]:text-primary-900"
          >
            Privacy & Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="gettingStarted">
          <Card>
            <CardHeader className="bg-primary-100 pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Book className="h-4 w-4" /> Getting Started with Asha
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <Accordion type="single" collapsible className="w-full">
                {filterContent("gettingStarted").map((item, index) => (
                  <AccordionItem value={`getting-started-${index}`} key={index}>
                    <AccordionTrigger className="text-left text-primary-900 hover:text-primary-700 text-sm py-3">
                      {item.title}
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-sm text-gray-700">{item.content}</p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features">
          <Card>
            <CardHeader className="bg-primary-100 pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <MessageSquare className="h-4 w-4" /> Asha Features
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <Accordion type="single" collapsible className="w-full">
                {filterContent("features").map((item, index) => (
                  <AccordionItem value={`features-${index}`} key={index}>
                    <AccordionTrigger className="text-left text-primary-900 hover:text-primary-700 text-sm py-3">
                      {item.title}
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-sm text-gray-700">{item.content}</p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="troubleshooting">
          <Card>
            <CardHeader className="bg-primary-100 pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <AlertTriangle className="h-4 w-4" /> Troubleshooting
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <Accordion type="single" collapsible className="w-full">
                {filterContent("troubleshooting").map((item, index) => (
                  <AccordionItem value={`troubleshooting-${index}`} key={index}>
                    <AccordionTrigger className="text-left text-primary-900 hover:text-primary-700 text-sm py-3">
                      {item.title}
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-sm text-gray-700">{item.content}</p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy">
          <Card>
            <CardHeader className="bg-primary-100 pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Shield className="h-4 w-4" /> Privacy & Security
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <Accordion type="single" collapsible className="w-full">
                {filterContent("privacy").map((item, index) => (
                  <AccordionItem value={`privacy-${index}`} key={index}>
                    <AccordionTrigger className="text-left text-primary-900 hover:text-primary-700 text-sm py-3">
                      {item.title}
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-sm text-gray-700">{item.content}</p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Chat History Feature Highlight */}
      <Card className="mt-6 border-primary-300">
        <CardHeader className="bg-primary-100 pb-3">
          <CardTitle className="text-primary-900 flex items-center gap-2 text-base">
            <History className="h-4 w-4" /> Chat History Feature
          </CardTitle>
          <CardDescription className="text-xs">
            Access your previous conversations with Asha
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h3 className="font-semibold text-sm text-primary-900">
                How to Access Your Chat History
              </h3>
              <ol className="list-decimal pl-5 space-y-1 text-xs">
                <li className="text-gray-700">
                  Open the sidebar by clicking the menu icon
                </li>
                <li className="text-gray-700">
                  Find the "Chat History" section
                </li>
                <li className="text-gray-700">
                  Click on any previous conversation
                </li>
                <li className="text-gray-700">
                  Use search to find specific chats
                </li>
              </ol>
              <div className="pt-2">
                <h4 className="font-medium text-xs text-primary-800">
                  Benefits
                </h4>
                <ul className="list-disc pl-5 pt-1 space-y-1 text-xs">
                  <li className="text-gray-700">
                    Reference previous information
                  </li>
                  <li className="text-gray-700">Continue conversations</li>
                  <li className="text-gray-700">Track job search progress</li>
                </ul>
              </div>
            </div>
            <div className="bg-gray-100 p-3 rounded-lg border border-gray-200 flex items-center justify-center">
              <div className="max-w-xs w-full">
                <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-300 scale-90">
                  <div className="bg-primary-800 text-white p-2 flex justify-between items-center text-xs">
                    <span className="font-medium">Chat History</span>
                    <button className="text-white text-xs px-2 py-1 rounded-md bg-primary-700 hover:bg-primary-600">
                      Clear All
                    </button>
                  </div>
                  <div className="divide-y divide-gray-200">
                    <div className="p-2 hover:bg-primary-50 cursor-pointer">
                      <p className="font-medium text-xs text-primary-900">
                        Job Search Tips
                      </p>
                      <p className="text-xs text-gray-500">
                        Yesterday, 2:45 PM
                      </p>
                    </div>
                    <div className="p-2 hover:bg-primary-50 cursor-pointer bg-primary-100">
                      <p className="font-medium text-xs text-primary-900">
                        Leadership Workshop
                      </p>
                      <p className="text-xs text-gray-500">Apr 25, 10:30 AM</p>
                    </div>
                    <div className="p-2 hover:bg-primary-50 cursor-pointer">
                      <p className="font-medium text-xs text-primary-900">
                        Mentorship Programs
                      </p>
                      <p className="text-xs text-gray-500">Apr 23, 4:15 PM</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserGuideContent;
