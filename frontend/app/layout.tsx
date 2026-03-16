import type { Metadata } from 'next';
import { Hahmlet, IBM_Plex_Sans_KR } from 'next/font/google';
import './globals.css';

const bodyFont = IBM_Plex_Sans_KR({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans'
});

const displayFont = Hahmlet({
  weight: ['500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display'
});

export const metadata: Metadata = {
  title: 'eungeum-sljeok Frontend',
  description: 'Railway monorepo frontend'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${bodyFont.variable} ${displayFont.variable}`}>
      <body className={bodyFont.className}>{children}</body>
    </html>
  );
}
