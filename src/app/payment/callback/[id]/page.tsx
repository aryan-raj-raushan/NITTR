"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "react-toastify";
import { api } from "~/trpc/react";

export default function PaymentCallbackPage() {
  const router = useRouter();
  const { id } = useParams();

  // Ensure that bookingId is always a string and not undefined
  const bookingId = Array.isArray(id) ? id[0] : id;

  useEffect(() => {
    // Check if bookingId is valid
    if (!bookingId || typeof bookingId !== 'string') {
      handleInvalidUrl();
      return;
    }

    try {
      // Try to process the URL and make any necessary API calls
      updateBookingMutation.mutate({ id: bookingId, bookingStatus: "CONFIRMED" });
    } catch (error) {
      console.error("Error processing payment callback:", error);
      handleInvalidUrl();
    }
  }, [bookingId]);

  const updateBookingMutation = api.booking.updateBookingById.useMutation({
    onSuccess: () => {
      toast.success("Booking confirmed!", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      router.push(`/payment/success/${bookingId}`);
    },
    onError: () => {
      toast.error("Failed to confirm booking. Please contact support.", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      router.push(`/payment/success/${bookingId}`);
    },
  });

  const handleInvalidUrl = () => {
    toast.error("Invalid URL or missing parameters. Redirecting to homepage.", {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
    router.push("/");
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p>Processing your payment, please wait...</p>
    </div>
  );
}
