import type { CSSProperties } from 'react';
import type { Metadata } from 'next';
import './globals.css';

const fontVariables = {
  '--font-sans':
    '"Avenir Next", "Pretendard", "Apple SD Gothic Neo", "Malgun Gothic", "Noto Sans KR", sans-serif',
  '--font-display':
    '"Iowan Old Style", "AppleMyungjo", "Nanum Myeongjo", "Times New Roman", serif'
} as CSSProperties;

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
    <html lang="ko" style={fontVariables}>
      <body>{children}</body>
    </html>
  );
}
