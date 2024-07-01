"use client";
import { zodResolver } from "@hookform/resolvers/zod";
// import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Bounce, toast } from "react-toastify";
import { ResendEmail } from "~/utils/url/authurl";
import { useEffect, useState } from "react";

export const AuthCredentialsValidator = z
  .object({
    name: z.string().min(2, {
      message: "Name must be at least 2 characters long.",
    }),
    email: z.string().email(),
    number: z.string(),
    password: z.string().min(6, {
      message: "Password must be at least 6 characters long.",
    }),
    confirmPassword: z.string().min(6, {
      message: "Password must be at least 6 characters long.",
    }),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      return ctx.addIssue({
        code: "custom",
        path: ["confirmPassword"],
        message: "The passwords did not match",
      });
    }
  });

export type TAuthCredentialsValidator = z.infer<
  typeof AuthCredentialsValidator
>;

export const LoginCredentialsValidator = z.object({
  email: z.string().email(),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters long.",
  }),
  callback: z.string().optional(),
});

export type TLoginCredentialsValidator = z.infer<
  typeof LoginCredentialsValidator
>;
interface RegisterComponentProps {
  callbackUrl: string;
}
export default function RegisterComponent({
  callbackUrl,
}: RegisterComponentProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TAuthCredentialsValidator>({
    resolver: zodResolver(AuthCredentialsValidator),
  });
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState<number>(300);
  const [email, setEmail] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedEmail = sessionStorage.getItem("email");
      setEmail(storedEmail);
    }
  }, []);

  

  const handleResendVerification = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(ResendEmail, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      });

      const data = await response.json();

      if (data.code === 200) {
        toast.success("Resend email successfully sent!", {
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
        setCountdown(119);
      }
    } catch (error) {
      toast.error("Failed", {
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
      console.error("Error fetching search results:", error);
    }
    setIsLoading(false);
  };

  const handleOpenGmailBox = () => {
    const gmailInboxURL = "https://mail.google.com/mail/u/0/";
    window.open(gmailInboxURL, "_blank");
  };

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
  };

  return (
          <div className="m-4 w-[600px] border p-4 shadow-lg">
            <div className="flex flex-col gap-5 max-sm:w-full">
              <div className="flex flex-col items-center gap-5">
                <div className="flex w-fit items-center justify-center rounded-full bg-[#F0FDF4] p-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="48"
                    height="48"
                    viewBox="0 0 48 48"
                    fill="none"
                  >
                    <rect
                      x="6"
                      y="10"
                      width="36"
                      height="28"
                      rx="2.66667"
                      stroke="#22C35E"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M6 14L24 26L42 14"
                      stroke="#22C35E"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <p className="text-center text-2xl font-medium text-primary">
                  {formatTime(countdown)}
                </p>
                <p className="text-center text-[25px] font-medium text-primary">
                  Verify your email to proceed
                </p>
                <p className="text-center">
                  We just sent an email to the address{" "}
                  <span className="font-bold text-primary">{email}</span>
                  <br />
                  Please check your email and click on the link provided <br />{" "}
                  to verify your address
                </p>
              </div>

              <div className="flex w-full justify-evenly gap-5 max-sm:w-full max-sm:flex-col">
                <button
                  className={`w-full ${isLoading ? "loading" : ""} rounded-md border border-gray-300 px-4 py-2`}
                  type="submit"
                  onClick={handleResendVerification}
                  disabled={countdown > 0}
                >
                  {isLoading
                    ? "Resending Email..."
                    : "Resend Verification Email"}
                </button>
                <button
                  className="w-full rounded-md bg-primary px-4 py-2 text-white"
                  type="submit"
                  onClick={handleOpenGmailBox}
                >
                  Go to My Inbox
                </button>
              </div>
            </div>
          </div>
  );
}
