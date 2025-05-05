import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'LANShare',
  description: 'Share files on your local network',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="app-container">
          {children}
        </div>
      </body>
    </html>
  );
}
