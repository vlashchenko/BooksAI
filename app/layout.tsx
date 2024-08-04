"use client";
import { Inter } from "next/font/google";
import BooksContextProvider from "./wrappers/BooksListContext";
import '../app/globals.css';
import Navbar from "./components/Navbar";
import BookDetailsContextProvider from "./wrappers/BookDetailsContext";
import LoginModal from "./components/LoginModal";
import { useState, useEffect } from "react";
import { SessionProvider, useSession, getSession } from "next-auth/react";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <SessionProvider>
          <AppContent>{children}</AppContent>
        </SessionProvider>
      </body>
    </html>
  );
}

function AppContent({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      await getSession();
      setIsLoading(false);
    };
    checkSession();
  }, []);

  return (
    <>
      <Navbar />
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
    </>
  );
}