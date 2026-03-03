import type { Metadata } from 'next';
import './globals.css';

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
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
