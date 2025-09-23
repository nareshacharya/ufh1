
import type { Metadata } from 'next';
import './globals.css';
import './modern-theme.css';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { ToastProvider } from '../components/ToastProvider';
import { ThemeProvider } from '../components/ThemeProvider';
import { TopNavigation } from '../components/TopNavigation';

export const metadata: Metadata = {
  title: 'Melody - Perfumery Platform',
  description: 'Advanced perfumery management system for creating and managing fragrances',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          href="https://cdn.jsdelivr.net/npm/remixicon@4.0.0/fonts/remixicon.css"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Pacifico&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="theme-transition">
        <ErrorBoundary>
          <ThemeProvider>
            <ToastProvider>
              <div className="min-h-screen bg-rgb-bg-primary">
                <TopNavigation />
                <main className="w-full">
                  {children}
                </main>
              </div>
            </ToastProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
