import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';

const atelierSans = localFont({
  src: '../node_modules/next/dist/next-devtools/server/font/geist-latin-ext.woff2',
  variable: '--font-sans',
  display: 'swap',
  weight: '100 900'
});

const atelierDisplay = localFont({
  src: '../node_modules/next/dist/next-devtools/server/font/geist-latin-ext.woff2',
  variable: '--font-display',
  display: 'swap',
  weight: '100 900'
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
    <html lang="ko" className={`${atelierSans.variable} ${atelierDisplay.variable}`}>
      <body>{children}</body>
    </html>
  );
}
