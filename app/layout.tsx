import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({ subsets: ['latin'] });
const geistMono = Geist_Mono({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Basketball Analytics Dashboard',
  description: 'NBA Performance and Statistics Analytics Platform - Explore team performance metrics, trends, and insights.',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="theme-color" content="#00d084" />
      </head>
      <body className={`${geistSans.className} bg-background text-foreground`}>
        {children}
      </body>
    </html>
  );
}
