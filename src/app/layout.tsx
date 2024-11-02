import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PerfectMIND reader',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className="h-full" lang="en">
      <body className="h-full">
        <main className="h-full p-16">{children}</main>
      </body>
    </html>
  );
}