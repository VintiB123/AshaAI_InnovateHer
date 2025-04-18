import { RiHome3Line, RiEmotionLaughLine, RiFlowChart } from "react-icons/ri";
import { RxDashboard } from "react-icons/rx";
import {
  TbUniverse,
  TbMessageChatbot,
  TbReportAnalytics,
} from "react-icons/tb";

import { LuBrain, LuUserRound } from "react-icons/lu";
import { FaGears, FaRegNewspaper } from "react-icons/fa6";
import { SlPeople } from "react-icons/sl";
import { IoSettingsOutline } from "react-icons/io5";

export const sidebarData = [
  {
    category: "dashboard",
    items: [
      { title: "overview", route: "/overview", icon: RiHome3Line },
      // { title: "reports", route: "/reports", icon: TbReportAnalytics },
    ],
  },
  {
    category: "marketplace",
    items: [
      {
        title: "workflows",
        route: "/marketplace/workflows",
        icon: RiFlowChart,
      },
      { title: "saved", route: "/marketplace/saved", icon: RxDashboard },
      {
        title: "favorites",
        route: "/marketplace/favorites",
        icon: RiEmotionLaughLine,
      },
      {
        title: "settings",
        route: "/marketplace/settings",
        icon: IoSettingsOutline,
      },
    ],
  },
  {
    category: "builder",
    items: [
      {
        title: "builder",
        route: "/builder/build",
        icon: TbMessageChatbot,
      },
      { title: "reports", route: "/builder/reports", icon: TbReportAnalytics },
    ],
  },
  {
    category: "help & docs",
    items: [
      { title: "user-guide", route: "/help/user-guide", icon: FaRegNewspaper },
      {
        title: "documentation",
        route: "/help/ai-docs",
        icon: LuBrain,
      },
      { title: "support", route: "/help/support", icon: SlPeople },
    ],
  },
  {
    category: "settings",
    items: [
      { title: "user-profile", route: "/settings/profile", icon: LuUserRound },
    ],
  },
];
