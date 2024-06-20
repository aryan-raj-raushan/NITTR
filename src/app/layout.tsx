import "~/styles/globals.css";

import { Inter } from "next/font/google";

import { Providers } from "~/trpc/react";
import { SessionProvider } from 'next-auth/react';
import Navbar from "./_components/navbar/navbar";
import { Toaster } from "~/components/ui/toaster";
import { ThemeProvider } from "~/components/theme-provider";
import Footer from "~/components/HomePage2/footer";

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "IITB",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">

      <body className={`relative h-full font-sans ${inter.variable}`}>
        <main className="relative flex flex-col min-h-screen " style={{ width: "100%" }}>
          <Providers>
            <Navbar />
          <ToastContainer />
            <div className="">{children}</div>
            <Toaster />
            <Footer />
          </Providers>
        </main>
      </body>
    </html>
  );
}
