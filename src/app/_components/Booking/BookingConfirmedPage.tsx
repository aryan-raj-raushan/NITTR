"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import BookingConfirmed from "./BookingConfirmed";

const BookingConfirmedPage = ({ booking }: { booking: any }) => {
  const router = useRouter();

  useEffect(() => {
    // Handle back button
    const handlePopState = () => {
      alert("Booking confirmed! Redirecting to the homepage...");
      router.replace("/");
    };

    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handlePopState);

    // Handle refresh
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
      alert("Booking confirmed! Redirecting to the homepage...");
      router.replace("/");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [router]);

  return <BookingConfirmed booking={booking} />;
};

export default BookingConfirmedPage;
