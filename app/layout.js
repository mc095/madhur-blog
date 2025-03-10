import './globals.css';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { ThemeProvider } from './context/ThemeContext';
import ThemeToggle from '../components/ThemeToggle';

export const metadata = {
  title: 'Ganesh Vathumilli',
  description: 'My Personal Space for Blogs',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-[var(--background)] text-[var(--text-primary)] font-sf flex flex-col min-h-screen">
        <ThemeProvider>
          <div className="fixed top-6 left-6 z-50 hidden md:block">
            <Link
              href="/"
              className="group relative w-12 h-12 flex items-center justify-center"
            >
              <div className="absolute inset-0 bg-[var(--button-bg)] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <ArrowLeft
                className="relative z-10 text-[var(--text-primary)] group-hover:text-[var(--text-secondary)] transition-colors"
                size={24}
              />
            </Link>
          </div>
          <header className="pt-16 pb-8 px-6">
            <div className="max-w-3xl mx-auto text-left">
              <h1 className="text-4xl font-bold">Ganesh Vathumilli</h1>
              <p className="mt-2 text-lg text-[var(--text-secondary)]">
                My space for thoughts, ideas, and stories.
              </p>
            </div>
          </header>
          <main className="px-6 py-8 flex-1">{children}</main>
          <footer className="px-6 py-4 text-center text-[var(--text-muted)] flex items-center justify-center">
            <p>© 2025 Ganesh Vathumilli. All rights reserved.</p>
            <ThemeToggle />
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}