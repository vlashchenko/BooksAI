<<<<<<< HEAD
// app/layout.tsx
"use client";
import { Inter } from "next/font/google";
import BooksContextProvider from "@/app/wrappers/BooksListContext";
import "./globals.css";
import Navbar from "@/app/components/Navbar";
import BookDetailsContextProvider from "@/app/wrappers/BookDetailsContext";
import { useSession, getSession } from "next-auth/react";
import LoginModal from "@/app/components/LoginModal";
import { useState, useEffect } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
=======
// newai/app/application/books/bookSummary/layout.tsx

"use client";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import { useSession, getSession } from "next-auth/react";
import LoginModal from "@/app/components/LoginModal";
import { useState, useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "@/app/store/store";

const inter = Inter({ subsets: ["latin"] });

export default function BookSummaryLayout({
>>>>>>> 120d04e39a931915842653f46b86dcdd8dd21657
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      await getSession();
      setIsLoading(false);
    };
    checkSession();
  }, []);

<<<<<<< HEAD
  // Provide the state and functions to the context
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
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
      </body>
    </html>
=======
  return (
    <Provider store={store}>
      <main className="flex-grow flex items-center justify-center bg-black">
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <>{status === "authenticated" ? children : <LoginModal />}</>
        )}
      </main>
    </Provider>
>>>>>>> 120d04e39a931915842653f46b86dcdd8dd21657
  );
}
