import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
// import { ClerkProvider } from "@clerk/nextjs";
import { LanguageProvider } from "@/context/LanguageContext";
import { GlobalProvider } from "@/context/GlobalContext";
import { ChatbotProvider } from "@/context/ChatbotContext";
import FloatingChatbot from "@/components/Chatbot/FloatingChatbot";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Asha AI",
  description: "A project by InnovateHer",
};

export async function generateStaticParams() {
  return [{ lang: "en-US" }, { lang: "hi" }, { lang: "mr" }];
}

export default async function RootLayout({ children, params }) {
  return (
    // <ClerkProvider>
    <LanguageProvider>
      <GlobalProvider>
        <ChatbotProvider>
          <html lang={(await params).lang} suppressHydrationWarning>
            <body
              className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
              {/* <Provider > */}
              {children}
              {/* </Provider> */}
              <div className="fixed bottom-4 right-4 z-50">
                {/* <FloatingChatbot /> */}
              </div>
            </body>
          </html>
        </ChatbotProvider>
      </GlobalProvider>
    </LanguageProvider>
  );
}
