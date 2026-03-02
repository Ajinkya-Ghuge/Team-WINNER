<<<<<<< HEAD
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WikiAgent",
  description: "Ask questions and get Wikipedia-grounded AI answers.",
=======
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'WikiAgent - AI-Powered Wikipedia Assistant',
  description: 'Factual answers powered by Wikipedia and GenAI',
>>>>>>> 65271435e9993ff644cbb120a2fa7bf1e6e906af
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
<<<<<<< HEAD
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
=======
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
>>>>>>> 65271435e9993ff644cbb120a2fa7bf1e6e906af
        {children}
      </body>
    </html>
  );
}
