"use client";

import { useLanguage } from "@/context/LanguageContext";
import { SignUp } from "@clerk/nextjs";

export default function Page() {
  const { currentLang } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <SignUp
        routing="path"
        path={`/${currentLang}/sign-up`}
        redirectUrl={`/${currentLang}/chat`}
        signInUrl={`/${currentLang}/sign-in`}
        appearance={{
          elements: {
            rootBox: "w-full max-w-md",
            card: "rounded-xl",
            headerTitle: "text-2xl font-bold text-primary-900",
            headerSubtitle: "text-gray-500",
            formButtonPrimary: "bg-primary-600 hover:bg-primary-800 w-full",
            socialButtonsBlockButton: "w-full",
            footerActionText: "text-center text-primary-400",
            footerActionLink: "text-primary-600 hover:text-primary-900 ml-1",
          },
        }}
      />
    </div>
  );
}
