// newai/app/application/books/bookSummary/layout.tsx

"use client";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import { useSession } from "next-auth/react";
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
    if (status === "unauthenticated") {
      // Redirect unauthenticated users to the NextAuth sign-in page
      router.push("/api/auth/signin");
    }
  }, [status, router]);

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