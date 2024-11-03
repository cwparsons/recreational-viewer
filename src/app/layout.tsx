import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Recreational reader',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <main className="p-4 md:p-16">{children}</main>
      </body>
    </html>
  );
}
