"use client";
import "~/styles/globals.css";

import AdminNav from "../_components/admin/AdminNav";
import { useSession } from "next-auth/react";
import { Bounce, ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated" && session.user.role !== "ADMIN") {
      toast.error("Unauthorized access. Redirecting to home page...", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });

      setTimeout(() => {
        if (session.user.role !== "ADMIN") {
          router.push("/");
        }
      }, 3000);
    }
  }, [status, session, router]);

  if (status === "loading") {
    return <div>Loading...</div>; 
  }

  if (status === "unauthenticated" || (status === "authenticated" && session.user.role !== "ADMIN")) {
    return <ToastContainer />;
  }

  return (
    <div>
      <ToastContainer />
    
      {children}
    </div>
  );
}
