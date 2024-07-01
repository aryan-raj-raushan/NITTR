import "~/styles/globals.css";
import { Inter } from "next/font/google";
import { Providers } from "~/trpc/react";
import Navbar from "./_components/navbar/navbar";
import { Toaster } from "~/components/ui/toaster";
import Footer from "~/components/HomePage2/footer";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import ReduxProvider from "~/store/ReduxProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "NITTTR",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`relative h-full font-sans ${inter.variable}`}>
        <main
          className="relative flex min-h-screen flex-col"
          style={{ width: "100%" }}
        >
          <GoogleOAuthProvider clientId={`${process.env.GOOGLE_CLIENT_ID}`}>
            <ReduxProvider>
              <Providers>
                <Navbar />
                <div className="">{children}</div>
                <Toaster />
                <Footer />
                <ToastContainer />
              </Providers>
            </ReduxProvider>
          </GoogleOAuthProvider>
        </main>
      </body>
    </html>
  );
}
