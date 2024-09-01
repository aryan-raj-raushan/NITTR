"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BookingConfirmed from "./BookingConfirmed";

const BookingConfirmedPage = ({ booking }: { booking: any }) => {
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [countdown, setCountdown] = useState(8);
  const [loading, setLoading] = useState(true);
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (booking) {
      setLoading(false);
    }
  }, [booking]);

  useEffect(() => {
    if (!loading) {
      if (booking.bookingStatus === "CANCELED") {
        setIsRedirecting(true);

        const countdownInterval = setInterval(() => {
          setCountdown((prevCountdown) => {
            if (prevCountdown <= 1) {
              clearInterval(countdownInterval);
              router.replace("/");
              return 0;
            }
            return prevCountdown - 1;
          });
        }, 1000);

        return () => clearInterval(countdownInterval);
      } else {
        const handlePopState = () => {
          if (!redirecting) {
            alert(
              "Booking confirmed! Redirecting to the homepage in 3 seconds...",
            );
            setRedirecting(true);
            setTimeout(() => router.replace("/"), 3000);
          }
        };

        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
          e.preventDefault();
          e.returnValue = ""; 
          if (!redirecting) {
            alert(
              "Booking confirmed! Redirecting to the homepage in 3 seconds...",
            );
            setRedirecting(true);
            setTimeout(() => router.replace("/"), 3000);
          }
        };

        window.history.pushState(null, "", window.location.href);
        window.addEventListener("popstate", handlePopState);
        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
          window.removeEventListener("popstate", handlePopState);
          window.removeEventListener("beforeunload", handleBeforeUnload);
        };
      }
    }
  }, [booking, loading, redirecting, router]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center bg-gray-100 p-4 text-black">
        <div className="rounded-lg p-6 text-center text-gray-700 shadow-lg">
          <h1 className="mb-4 text-2xl font-bold">Loading...</h1>
          <p>Please wait while we process your booking.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {booking.bookingStatus === "CANCELED" && isRedirecting ? (
        <div className="flex min-h-[60vh] flex-col items-center justify-center bg-gray-100 p-4">
          <div className="rounded-lg p-6 text-center text-black shadow-lg">
            <h1 className="mb-4 text-2xl font-bold text-red-500">
              Payment Failed!!!!
            </h1>
            <p className="mb-4 text-black">
              Your payment was not successful. If there was a deduction, please
              contact your bank.
            </p>
            <p className="text-lg font-semibold text-black">
              Redirecting to the homepage in{" "}
              <span className="text-red-500">{countdown}</span> seconds...
            </p>
          </div>
        </div>
      ) : (
        <BookingConfirmed booking={booking} />
      )}
    </>
  );
};

export default BookingConfirmedPage;
