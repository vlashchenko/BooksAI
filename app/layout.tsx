// app/layout.tsx

"use client";

import { Inter } from "next/font/google";
import "../app/globals.css";
import Navbar from "./components/Navbar";
import { SessionProvider, useSession } from "next-auth/react";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { useRouter } from "next/navigation";
import { Suspense, useEffect } from "react";
import Loading from "./loading"; 

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
          <Provider store={store}>
            <Suspense fallback={<Loading />}>
              <AppContent>{children}</AppContent>
            </Suspense>
          </Provider>
        </SessionProvider>
      </body>
    </html>
  );
}

function AppContent({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      // Redirect unauthenticated users to NextAuth sign-in page
      router.push("/api/auth/signin");
    }
  }, [status, router]);

  return (
    <>
      <Navbar />
      <main className="flex-grow flex items-center justify-center bg-black">
        {status === "authenticated" && children}
      </main>
    </>
  );
}