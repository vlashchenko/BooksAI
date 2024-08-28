"use client";

import { Inter } from "next/font/google";
import "@/app/globals.css";
import { useSession, signOut } from "next-auth/react";
import { Provider } from "react-redux";
import { store } from "@/app/store/store";
import { useRouter } from "next/navigation";
import { Suspense, useEffect } from "react";
import Loading from "@/app/loading"; // Ensure this path is correct

const inter = Inter({ subsets: ["latin"] });

export default function BookSummaryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // Don't do anything if session is still loading

    if (!session) {
      router.push("/api/auth/signin"); // Redirect to sign-in if not authenticated
    } else {
      // Here you can also handle token expiration manually
      // For example, sign out the user if the token is invalid
      const expiresAt = session.expires ? new Date(session.expires) : null;
      if (expiresAt && expiresAt < new Date()) {
        signOut(); // Optional: Sign out the user
        router.push("/api/auth/signin");
      }
    }
  }, [session, status, router]);

  if (status === "loading" || !session) {
    return <Loading />; // Optionally, render a loading state
  }

  return (
    <Provider store={store}>
      <main className="flex-grow flex items-center justify-center bg-black">
        <Suspense fallback={<Loading />}>
          {status === "authenticated" && children}
        </Suspense>
      </main>
    </Provider>
  );
}