import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VisionAttend AI - Face Recognition Attendance System",
  description: "AI Powered Face Recognition Attendance System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} dark`}>
      <body className="min-h-screen bg-background text-foreground antialiased">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#111111",
              color: "#F5F5F5",
              border: "1px solid #222222",
              borderRadius: "12px",
            },
            success: {
              iconTheme: { primary: "#22C55E", secondary: "#111111" },
            },
            error: {
              iconTheme: { primary: "#EF4444", secondary: "#111111" },
            },
          }}
        />
      </body>
    </html>
  );
}
