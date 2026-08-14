import type { Metadata } from "next";
import "@/styles.css";
import { ChatWidget } from "@/components/chat/ChatWidget";  // ← ADD THIS

export const metadata: Metadata = {
  title: "Ace New Interior — Architectural Interior Design Studio",
  description:
    "Ace New Interior curates residential and commercial spaces defined by clarity, materiality and enduring architectural presence.",
  openGraph: {
    title: "Ace New Interior — Architectural Interior Design Studio",
    description:
      "Ace New Interior curates residential and commercial spaces defined by clarity, materiality and enduring architectural presence.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400..800;1,400..800&family=Hanken+Grotesk:ital,wght@0,100..900;1,100..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
        <ChatWidget />  {/* ← ADD THIS */}
      </body>
    </html>
  );
}