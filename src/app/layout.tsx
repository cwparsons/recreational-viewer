import type { Metadata, Viewport } from 'next';

import './globals.css';

export const metadata: Metadata = {
  title: 'Recreational reader',
  description: 'Browse recreational courses and activities',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-white font-sans text-gray-900 antialiased accent-blue-500 dark:bg-gray-900 dark:text-gray-100">
        <main className="flex flex-col gap-4 p-4 md:p-16">{children}</main>
      </body>
    </html>
  );
}
