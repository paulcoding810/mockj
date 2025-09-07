import Logo from "@/components/logo";
import Providers from "@/lib/providers";
import "@mockj/tailwind-config/globals.css";
import type { Metadata } from "next";
import localFont from "next/font/local";
import Link from "next/link";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "MockJ - JSON Mock API Generator",
  description:
    "Create and manage JSON mock endpoints for testing and development",
};

function Header() {
  return (
    <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Logo />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                MockJ
              </span>
            </Link>
          </div>

          {/* <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
            >
              Home
            </Link>
            <Link 
              href="/" 
              className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
            >
              Create Mock
            </Link>
          </nav>
          
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="/">New Mock</Link>
            </Button>
          </div> */}
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
              <Logo size="small" />
            </div>
            <span className="text-gray-600 dark:text-gray-400">MockJ</span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Create JSON mock endpoints for testing and development
          </p>
        </div>
      </div>
    </footer>
  );
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <Providers>
        <body
          className={`${geistSans.variable} ${geistMono.variable} h-full flex flex-col`}
        >
          <Header />
          <main className="flex-1 bg-gray-50 dark:bg-gray-950">{children}</main>
          <Footer />
        </body>
      </Providers>
    </html>
  );
}
