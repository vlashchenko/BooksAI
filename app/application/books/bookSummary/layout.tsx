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
  );
}
