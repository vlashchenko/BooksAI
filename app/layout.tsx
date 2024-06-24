// app/layout.tsx

"use client";
import { Inter } from "next/font/google";
import BooksContextProvider from "./wrappers/BooksListContext";
import '../../../globals.css';
import Navbar from "./components/Navbar";
import BookDetailsContextProvider from "./wrappers/BookDetailsContext";
import { useSession, getSession } from "next-auth/react";
import LoginModal from "./components/LoginModal";
import { useState, useEffect } from "react";
import { SessionProvider } from "next-auth/react";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession();
      setIsLoading(false);
    };
    checkSession();
  }, []);

  // Provide the state and functions to the context
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <Navbar />
        <SessionProvider>
        <BookDetailsContextProvider>
          <BooksContextProvider>
            <main className="flex-grow flex items-center justify-center bg-black">
              {isLoading ? (
                <div>Loading...</div>
              ) : (
                <>
                  {status === "authenticated" ? (
                    children
                  ) : (
                    <LoginModal />
                  )}
                </>
              )}
            </main>
          </BooksContextProvider>
        </BookDetailsContextProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
