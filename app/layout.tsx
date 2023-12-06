import { Inter } from "next/font/google";
import BooksContextProvider from "./components/BookContext";
import "./globals.css";
import Navbar from "./components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Provide the state and functions to the context
  return (
    <html lang="en">
      <body>
      <Navbar/>
        <BooksContextProvider>{children}</BooksContextProvider>
      </body>
    </html>
  );
}
