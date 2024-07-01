"use client";
import "~/styles/globals.css";
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAppSelector } from "~/store";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isLogin = useAppSelector((state) => state.auth.authState);
  const { role } = useAppSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (isLogin && role !== "ADMIN") {
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
        if (role !== "ADMIN") {
          router.push("/");
        }
      }, 3000);
    }
  }, [isLogin, role, router]);

  if (!isLogin) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!isLogin || (isLogin && role !== "ADMIN")) {
    return <ToastContainer />;
  }

  return (
    <div>
      <ToastContainer />
      {children}
    </div>
  );
}
