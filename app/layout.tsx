// app/layout.tsx

import { Inter } from "next/font/google";
import BooksContextProvider from "./wrappers/BooksListContext";
import "./globals.css";
import Navbar from "./components/Navbar";
import BookDetailsContextProvider from "./wrappers/BookDetailsContext";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Provide the state and functions to the context
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <Navbar />
        <BookDetailsContextProvider>
          <BooksContextProvider>
            <main className="flex-grow flex items-center justify-center bg-black">
              {children}
            </main>
          </BooksContextProvider>
        </BookDetailsContextProvider>
      </body>
    </html>
  );
}
