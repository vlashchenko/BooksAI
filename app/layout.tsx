// newai/app/layout.tsx

"use client";

"use client";
import { Inter } from "next/font/google";
import BooksContextProvider from "./wrappers/BooksListContext";
import "../app/globals.css";
import Navbar from "./components/Navbar";
import BookDetailsContextProvider from "./wrappers/BookDetailsContext";
<<<<<<< HEAD
import { useSession, getSession } from "next-auth/react";
import LoginModal from "./components/LoginModal";
import { useState, useEffect } from "react";
import { SessionProvider } from "next-auth/react";
=======
import LoginModal from "./components/LoginModal";
import { useState, useEffect } from "react";
import { SessionProvider, useSession, getSession } from "next-auth/react";
import { Provider } from "react-redux";
import { store } from "./store/store";
>>>>>>> 120d04e39a931915842653f46b86dcdd8dd21657

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
<<<<<<< HEAD
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
=======
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <SessionProvider>
          <Provider store={store}>
            <BooksContextProvider>
              <BookDetailsContextProvider>
                <AppContent>{children}</AppContent>
              </BookDetailsContextProvider>
            </BooksContextProvider>
          </Provider>
>>>>>>> 120d04e39a931915842653f46b86dcdd8dd21657
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
      <main className="flex-grow flex items-center justify-center bg-black">
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <>{status === "authenticated" ? children : <LoginModal />}</>
        )}
      </main>
    </>
  );
}
