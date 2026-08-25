import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'APEX Terminal | Real-Time Engine',
  description: 'APEX Terminal is a real-time creative and AI-native development cockpit.',
  applicationName: 'APEX Terminal',
  keywords: ['APEX', 'real-time engine', 'creative studio', 'AI development'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-[#050a10]">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
