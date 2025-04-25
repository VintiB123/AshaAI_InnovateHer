// "use client";

// import { useParams, useRouter } from "next/navigation";
// import { useGlobalState } from "@/context/GlobalContext";
// import { useLanguage } from "@/context/LanguageContext";
// import Image from "next/image";
// import Link from "next/link";
// import Logo from "@/public/images/logo.png";

// // Import icons
// import { RiHome3Line, RiFlowChart, RiLogoutBoxLine } from "react-icons/ri";
// import {
//   TbReportAnalytics,
//   TbMessageChatbot,
//   TbCalendar,
// } from "react-icons/tb";
// import { LuBrain, LuUserRound, LuGoal } from "react-icons/lu";
// import { FaUsers, FaComments } from "react-icons/fa6";
// import { useState, useEffect } from "react";

// const menteeSidebarData = [
//   {
//     category: "dashboard",
//     items: [{ title: "overview", route: "/overview", icon: RiHome3Line }],
//   },
//   {
//     category: "career development",
//     items: [
//       {
//         title: "career path",
//         route: "/career-development/career-path",
//         icon: RiFlowChart,
//       },
//       {
//         title: "find mentor",
//         route: "/career-development/find-mentor",
//         icon: FaUsers,
//       },
//       {
//         title: "goal tracking",
//         route: "/career-development/goals",
//         icon: LuGoal,
//       },
//     ],
//   },
//   {
//     category: "learning",
//     items: [
//       {
//         title: "submissions",
//         route: "/learning/submissions",
//         icon: TbReportAnalytics,
//       },
//       {
//         title: "resources",
//         route: "/learning/resources",
//         icon: LuBrain,
//       },
//       {
//         title: "discussions",
//         route: "/learning/discussions",
//         icon: FaComments,
//       },
//     ],
//   },
//   {
//     category: "communication",
//     items: [
//       {
//         title: "calendar",
//         route: "/communication/calendar",
//         icon: TbCalendar,
//       },
//       {
//         title: "messaging",
//         route: "/communication/message",
//         icon: FaComments,
//       },
//       // {
//       //   title: "chatbot",
//       //   route: "/communication/chatbot",
//       //   icon: TbMessageChatbot,
//       // },
//     ],
//   },
//   {
//     category: "settings",
//     items: [
//       {
//         title: "user-profile",
//         route: "/settings/profile",
//         icon: LuUserRound,
//       },
//     ],
//   },
// ];

// const mentorSidebarData = [
//   {
//     category: "dashboard",
//     items: [{ title: "overview", route: "/overview", icon: RiHome3Line }],
//   },
//   {
//     category: "mentorship",
//     items: [
//       {
//         title: "mentees",
//         route: "/mentees",
//         icon: FaUsers,
//       },
//       {
//         title: "submissions",
//         route: "/submissions",
//         icon: TbReportAnalytics,
//       },
//     ],
//   },
//   {
//     category: "communication",
//     items: [
//       {
//         title: "messaging",
//         route: "/communication/message",
//         icon: FaComments,
//       },
//       {
//         title: "calendar",
//         route: "/communication/calendar",
//         icon: TbCalendar,
//       },
//     ],
//   },
//   {
//     category: "settings",
//     items: [
//       {
//         title: "user-profile",
//         route: "/settings/profile",
//         icon: LuUserRound,
//       },
//     ],
//   },
// ];

// const Sidebar = () => {
//   const { sidebarState } = useGlobalState();
//   const { currentLang, dict } = useLanguage();
//   const params = useParams();
//   const router = useRouter();

//   // State to store user details from local storage
//   const [userDetails, setUserDetails] = useState({
//     name: "",
//     email: "",
//   });

//   // Extract user type from params
//   const loginType = params?.role || "mentee";

//   // Choose sidebar data based on login type
//   const sidebarData =
//     loginType === "mentor" ? mentorSidebarData : menteeSidebarData;

//   // Effect to retrieve user details from local storage
//   useEffect(() => {
//     const storedName = localStorage.getItem("userName") || "User";
//     const storedEmail = localStorage.getItem("userEmail") || "User email";
//     setUserDetails({ name: storedName, email: storedEmail });
//   }, []);

//   // Handle logout function
//   const handleLogout = () => {
//     // Remove user data from local storage
//     localStorage.removeItem("userName");
//     localStorage.removeItem("userEmail");
//     localStorage.removeItem("userRole");

//     // Redirect to sign-in page
//     router.push(`/${currentLang}/sign-in`);
//   };

//   return (
//     <div className="relative h-screen max-md:hidden">
//       {/* Background with gradient and subtle glow */}
//       <div
//         className={`absolute inset-0
//           bg-gradient-to-br
//           from-purple-300/50
//           to-lavender-200/50
//           opacity-70
//           blur-lg
//           -z-10
//           shadow-2xl
//           ${sidebarState ? "w-[17rem]" : "w-20"}
//         `}
//       />

//       {/* Sidebar container with enhanced styling */}
//       <div
//         className={`
//           h-screen
//           flex
//           flex-col
//           justify-between
//           py-4
//           bg-purple-100
//           backdrop-blur-xl
//           ${sidebarState ? "w-[17rem] px-2" : "w-20 px-0.5"}
//           shadow-[0_10px_50px_-15px_rgba(145,99,203,0.3)]
//           border-r
//           border-purple-200/50
//           transition-all
//           duration-300
//           ease-in-out
//         `}
//       >
//         <div className="flex flex-col justify-start items-start">
//           <div className="flex justify-between items-center mb-2" id="step1">
//             <Image
//               src={Logo}
//               alt="MentorHer Logo"
//               className="h-16 w-auto mb-5 tour-logo"
//             />
//           </div>

//           <nav className="px-2">
//             {sidebarData.map((category, index) => (
//               <div key={index} className="mb-4">
//                 {sidebarState && (
//                   <p className="text-sm font-semibold text-purple-800 uppercase mb-3">
//                     {dict?.sidebar?.[category.category] || category.category}
//                   </p>
//                 )}
//                 <ul>
//                   {category.items.map((item, itemIndex) => (
//                     <li
//                       key={itemIndex}
//                       className="flex items-center mb-5"
//                       id={`${item.title === "chatbot" ? "amigo" : ""}`}
//                     >
//                       <Link
//                         href={`/${currentLang}/${loginType}${item.route}`}
//                         className={`
//                           flex
//                           items-center
//                           gap-3
//                           text-purple-700
//                           hover:text-purple-900
//                           hover:bg-purple-200/50
//                           rounded-lg
//                           transition
//                           group
//                           ${sidebarState ? "pl-2 py-1" : "w-14 justify-center"}
//                         `}
//                       >
//                         <span
//                           className={`${
//                             sidebarState ? "text-xl" : "text-2xl mb-3"
//                           } group-hover:text-purple-900`}
//                         >
//                           <item.icon />
//                         </span>
//                         {sidebarState && (
//                           <span className="text-purple-800 group-hover:font-semibold">
//                             {dict?.sidebar?.[item.title] || item.title}
//                           </span>
//                         )}
//                       </Link>
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             ))}
//           </nav>
//         </div>

//         <div className="flex flex-col space-y-4">
//           {/* Logout Button */}
//           <button
//             onClick={handleLogout}
//             className={`
//               flex
//               items-center
//               gap-3
//               text-red-600
//               hover:text-red-700
//               hover:bg-red-100/50
//               rounded-lg
//               transition
//               group
//               ${
//                 sidebarState
//                   ? "mx-2 pl-2 py-2"
//                   : "w-14 mx-auto justify-center py-2"
//               }
//             `}
//           >
//             <span
//               className={`${
//                 sidebarState ? "text-xl" : "text-2xl"
//               } group-hover:text-red-700`}
//             >
//               <RiLogoutBoxLine />
//             </span>
//             {sidebarState && (
//               <span className="text-red-600 group-hover:font-semibold">
//                 {dict?.sidebar?.logout || "Logout"}
//               </span>
//             )}
//           </button>

//           {/* User Profile Section */}
//           <div
//             className={`flex ${
//               sidebarState ? "justify-start mx-2" : "justify-center"
//             } items-center px-2`}
//           >
//             <div className="h-10 w-10 bg-purple-300 rounded-full flex items-center justify-center text-white font-semibold shadow-md">
//               {userDetails.name.charAt(0).toUpperCase()}
//             </div>

//             {sidebarState && (
//               <div className="flex flex-col justify-center items-start ml-3">
//                 <h1 className="text-purple-900 font-semibold">
//                   {userDetails.name}
//                 </h1>
//                 <h3 className="text-[0.75rem] text-purple-700/70 -mt-0.5 font-medium">
//                   {userDetails.email}
//                 </h3>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;

// components/Sidebar.jsx
"use client";
import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Plus,
  Search,
  ChevronDown,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useGlobalState } from "@/context/GlobalContext";
import { Input } from "@/components/ui/input";
import { UserButton, useUser } from "@clerk/nextjs";

export default function Sidebar({ onToggle }) {
  const [expanded, setExpanded] = useState(true);
  const [activeSection, setActiveSection] = useState("today");
  const { sidebarState } = useGlobalState();
  const { user } = useUser();

  const toggleSidebar = () => {
    setExpanded(!expanded);
    if (onToggle) {
      onToggle(expanded);
    }
  };

  const toggleSection = (section) => {
    setActiveSection(activeSection === section ? null : section);
  };

  // Sample chat history data
  const chatHistory = {
    today: [
      { id: 1, title: "How to be a better person?" },
      { id: 2, title: "Career advice for women in tech" },
    ],
    previous: [
      { id: 3, title: "Work-life balance tips" },
      { id: 4, title: "Learning resources for coding" },
    ],
  };

  return (
    <div
      className={`bg-white border-r border-primary-200 transition-all duration-300 flex flex-col h-full ${
        expanded ? "w-64" : "w-16"
      }`}
    >
      {/* Header with toggle button */}
      <div className="flex items-center justify-between p-4 border-b border-primary-200">
        {expanded ? (
          <div className="flex items-center">
            <span className="text-primary-900 font-semibold">Asha.AI</span>
          </div>
        ) : (
          <div className="w-full flex justify-center">
            <span className="text-primary-900 font-bold">A</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleSidebar}
          className="text-primary-700 hover:bg-primary-100"
        >
          {expanded ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </Button>
      </div>

      {/* New Chat Button - Now the FIRST and ONLY top-level action */}
      <div className="p-2 border-b border-primary-100">
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className={`w-full ${
                  expanded ? "justify-start gap-2 px-3" : "justify-center px-2"
                } bg-primary-700 hover:bg-primary-800 text-white`}
              >
                <Plus size={18} />
                {expanded && "New Chat"}
              </Button>
            </TooltipTrigger>
            {!expanded && (
              <TooltipContent side="right">New Chat</TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Chat history sections */}
      <div className="flex-1 overflow-y-auto py-2">
        {expanded ? (
          <>
            {/* Today's chats */}
            <div className="mb-2 px-2">
              <Button
                variant="ghost"
                className="w-full flex justify-between items-center px-3 text-sm font-medium text-primary-900 hover:bg-primary-100"
                onClick={() => toggleSection("today")}
              >
                <span>Today</span>
                <ChevronDown
                  size={16}
                  className={`transform transition-transform ${
                    activeSection === "today" ? "" : "-rotate-90"
                  }`}
                />
              </Button>

              {activeSection === "today" && (
                <div className="mt-1 space-y-1">
                  {chatHistory.today.map((chat) => (
                    <Button
                      key={chat.id}
                      variant="ghost"
                      className="w-full justify-start pl-6 pr-2 py-2 h-auto text-left hover:bg-primary-100 text-primary-800"
                    >
                      <MessageSquare
                        size={14}
                        className="text-primary-500 mr-2"
                      />
                      <span className="text-sm truncate">{chat.title}</span>
                    </Button>
                  ))}
                </div>
              )}
            </div>

            {/* Previous chats */}
            <div className="px-2">
              <Button
                variant="ghost"
                className="w-full flex justify-between items-center px-3 text-sm font-medium text-primary-900 hover:bg-primary-100"
                onClick={() => toggleSection("previous")}
              >
                <span>Previous</span>
                <ChevronDown
                  size={16}
                  className={`transform transition-transform ${
                    activeSection === "previous" ? "" : "-rotate-90"
                  }`}
                />
              </Button>

              {activeSection === "previous" && (
                <div className="mt-1 space-y-1">
                  {chatHistory.previous.map((chat) => (
                    <Button
                      key={chat.id}
                      variant="ghost"
                      className="w-full justify-start pl-6 pr-2 py-2 h-auto text-left hover:bg-primary-100 text-primary-800"
                    >
                      <MessageSquare
                        size={14}
                        className="text-primary-500 mr-2"
                      />
                      <span className="text-sm truncate">{chat.title}</span>
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </>
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
            expanded ? "justify-start" : "justify-center"
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

          {expanded && (
            <div className="flex flex-col justify-center items-start ml-3">
              <h1 className="text-primary-900 font-semibold text-sm">
                {user?.fullName || "User"}
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
