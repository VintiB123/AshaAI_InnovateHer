// "use client";

// import { usePathname, useRouter } from "next/navigation";
// import LanguageSwitcher from "./LanguageButton";
// import { Button } from "../ui/button";
// import { ArrowLeft } from "lucide-react";
// import {
//   Breadcrumb,
//   BreadcrumbItem,
//   BreadcrumbLink,
//   BreadcrumbList,
//   BreadcrumbPage,
//   BreadcrumbSeparator,
// } from "@/components/ui/breadcrumb";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from "@/components/ui/tooltip";
// import { useEffect, useState } from "react";
// import { useLanguage } from "@/context/LanguageContext";

// import VoiceControl from "./VoiceControl";
// import { useUser } from "@clerk/nextjs";
// import { useNextStep } from "nextstepjs";

// const Header = () => {
//   const pathname = usePathname();
//   const router = useRouter();
//   const { dict, currentLang } = useLanguage();

//   const [breadcrumbItems, setBreadcrumbItems] = useState([]);
//   const [title, setTitle] = useState("");
//   const [coins, setCoins] = useState(100);
//   const { user } = useUser();
//   const {
//     startNextStep,
//     closeNextStep,
//     currentTour,
//     currentStep,
//     setCurrentStep,
//     isNextStepVisible,
//   } = useNextStep();

//   const chatbotPath = pathname.split("/").filter(Boolean).pop();
//   const isInGameRoute = /^\/[a-z]{2}\/games\/[a-z-]+\/[a-z-]+$/i.test(pathname);

//   useEffect(() => {
//     if (!pathname) return;

//     const pathWithoutLang = pathname.replace(/^\/[a-z]{2}\//, "");
//     const pathParts = pathWithoutLang.split("/").filter(Boolean);

//     const breadcrumbList = pathParts.map((part, index) => {
//       const normalizedPart = part.trim();
//       let label = dict?.breadcrumb?.[normalizedPart] || normalizedPart;
//       label = label
//         .replace(/-/g, " ")
//         .replace(/\b\w/g, (char) => char.toUpperCase());
//       const href = `/${currentLang}/` + pathParts.slice(0, index + 1).join("/");
//       return { label, href };
//     });

//     setBreadcrumbItems(breadcrumbList);
//   }, [pathname, dict, currentLang, user]);

//   const handleStartTour = () => {
//     startNextStep("mainTour");
//   };

//   return (
//     <div className="relative">
//       <div className="flex justify-between items-center mb-4">
//         <div className="flex flex-col items-start">
//           <Breadcrumb>
//             <BreadcrumbList>
//               {breadcrumbItems.map((item, index) => (
//                 <BreadcrumbItem key={index}>
//                   {index < breadcrumbItems.length - 1 ? (
//                     <BreadcrumbLink href={item.href}>
//                       {item.label}
//                     </BreadcrumbLink>
//                   ) : (
//                     <BreadcrumbPage>{item.label}</BreadcrumbPage>
//                   )}
//                   {index < breadcrumbItems.length - 1 && (
//                     <BreadcrumbSeparator />
//                   )}
//                 </BreadcrumbItem>
//               ))}
//             </BreadcrumbList>
//           </Breadcrumb>

//           <h1 className="mt-2 font-semibold tracking-tight sm:text-md md:text-lg lg:text-xl xl:text-2xl">
//             {breadcrumbItems[breadcrumbItems.length - 1]?.label || "Home"}
//           </h1>
//         </div>
//         <div className="flex-center gap-x-3">
//           <VoiceControl />
//           {isInGameRoute && (
//             <Button variant="destructive" onClick={() => router.back()}>
//               <ArrowLeft className="h-4 w-4 mr-2" />
//               {dict?.breadcrumb?.go_back}
//             </Button>
//           )}
//           <Button
//             variant="outline"
//             className="border-green-500 "
//             onClick={handleStartTour}
//           >
//             Start
//           </Button>
//           <LanguageSwitcher currentLang={currentLang} />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Header;

"use client";

import { usePathname, useRouter } from "next/navigation";
import LanguageSwitcher from "./LanguageButton";
import { Button } from "../ui/button";
import { ArrowLeft, BookOpen } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

import { useUser } from "@clerk/nextjs";
import { useNextStep } from "nextstepjs";
import UserGuideContent from "./UserGuide";

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { dict, currentLang } = useLanguage();
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  const [breadcrumbItems, setBreadcrumbItems] = useState([]);
  const [title, setTitle] = useState("");
  const [coins, setCoins] = useState(100);
  const { user } = useUser();
  const {
    startNextStep,
    closeNextStep,
    currentTour,
    currentStep,
    setCurrentStep,
    isNextStepVisible,
  } = useNextStep();

  const chatbotPath = pathname.split("/").filter(Boolean).pop();
  const isInGameRoute = /^\/[a-z]{2}\/games\/[a-z-]+\/[a-z-]+$/i.test(pathname);

  useEffect(() => {
    if (!pathname) return;

    const pathWithoutLang = pathname.replace(/^\/[a-z]{2}\//, "");
    const pathParts = pathWithoutLang.split("/").filter(Boolean);

    const breadcrumbList = pathParts.map((part, index) => {
      const normalizedPart = part.trim();
      let label = dict?.breadcrumb?.[normalizedPart] || normalizedPart;
      label = label
        .replace(/-/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());
      const href = `/${currentLang}/` + pathParts.slice(0, index + 1).join("/");
      return { label, href };
    });

    setBreadcrumbItems(breadcrumbList);
  }, [pathname, dict, currentLang, user]);

  const handleStartTour = () => {
    startNextStep("mainTour");
  };

  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-4">
        <div className="flex flex-col items-start">
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbItems.map((item, index) => (
                <BreadcrumbItem key={index}>
                  {index < breadcrumbItems.length - 1 ? (
                    <BreadcrumbLink
                      href={item.href}
                      className="text-xs sm:text-sm md:text-base" // Responsive text sizing
                    >
                      {item.label}
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage className="text-xs sm:text-sm md:text-base">
                      {item.label}
                    </BreadcrumbPage>
                  )}
                  {index < breadcrumbItems.length - 1 && (
                    <BreadcrumbSeparator className="text-xs sm:text-sm" />
                  )}
                </BreadcrumbItem>
              ))}
            </BreadcrumbList>
          </Breadcrumb>

          <h1 className="mt-2 font-semibold tracking-tight text-sm sm:text-md md:text-lg lg:text-xl">
            {breadcrumbItems[breadcrumbItems.length - 1]?.label || "Home"}
          </h1>
        </div>
        <div className="flex items-center gap-x-2 sm:gap-x-3">
          <Dialog open={isGuideOpen} onOpenChange={setIsGuideOpen}>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="border-primary-500 hover:bg-primary-100 text-xs sm:text-sm px-2 py-1 sm:px-3 sm:py-2 h-auto flex items-center justify-center"
                      id="userguide"
                    >
                      {/* Center the icon when alone */}
                      <div className="flex items-center justify-center">
                        <BookOpen className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span className="hidden xs:inline ml-1 sm:ml-2">
                          {dict?.breadcrumb?.user_guide || "User Guide"}
                        </span>
                      </div>
                    </Button>
                  </DialogTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{dict?.tooltip?.user_guide || "View Asha User Guide"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-primary-900">
                  Asha User Guide
                </DialogTitle>
                <DialogDescription>
                  Learn how to effectively use Asha, your AI assistant for the
                  JobsForHer Foundation platform
                </DialogDescription>
              </DialogHeader>
              <UserGuideContent />
            </DialogContent>
          </Dialog>

          {isInGameRoute && (
            <Button
              variant="destructive"
              onClick={() => router.back()}
              className="text-xs sm:text-sm px-2 py-1 sm:px-3 sm:py-2 h-auto"
            >
              <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden xs:inline">
                {dict?.breadcrumb?.go_back || "Back"}
              </span>
            </Button>
          )}

          <Button
            variant="outline"
            className="border-green-500 text-xs sm:text-sm px-2 py-1 sm:px-3 sm:py-2 h-auto"
            onClick={handleStartTour}
          >
            Start
          </Button>

          <div className="scale-90 sm:scale-100">
            <LanguageSwitcher currentLang={currentLang} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
