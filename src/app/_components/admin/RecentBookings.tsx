"use client"
// @ts-ignore
import { BookingDetails, BookingStatus } from "@prisma/client";
import { api } from "~/trpc/react";
import { Separator } from "~/components/ui/separator";

export function RecentBookings({ bookings, setSelectedBooking, selectedBooking }: { bookings: BookingDetails[], setSelectedBooking: Function, selectedBooking: BookingDetails }) {

  const sortedBookings = bookings.sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const utils = api.useUtils();
  const updateBookingStatusMutation = api.booking.updateBookingById.useMutation(
    {
      onSuccess: async ({ booking }) => {
        utils.booking.getAllBookings.invalidate();
        window.location.reload();
      },
    },
  );


  return (
    <div className="space-y-8 overflow-y-scroll no-scrollbar cursor-pointer h-full">
      {sortedBookings.map((b, index) => {
        return (
          <div
            key={b.id + index}
            onClick={() => setSelectedBooking(b)}
            className={`flex items-center rounded-2xl p-3 hover:bg-gray-100 ${selectedBooking?.id == b.id ? "bg-gray-100" : ""} border border-gray-300`}
          >
            <div className="flex w-full flex-col gap-2">
              <p className=" flex sm:flex-row flex-col justify-between">
                <span className="text-lg font-semibold">
                  Booking Id - <span className="sm:text-base text-sm">{b.id}</span>
                </span>
                <span
                  className={`flex items-center rounded-full px-4 py-1 text-xs sm:w-auto w-1/2  ${b.bookingStatus === "CANCELED" ? "bg-red-500 text-white" : b.bookingStatus === "UNCONFIRMED" ? "bg-amber-300 text-black" : "bg-green-500 text-white"}`}
                >
                  {b.bookingStatus === "UNCONFIRMED"
                    ? "PENDING"
                    : b.bookingStatus}
                </span>
              </p>
              <div>
                <span className="text-lg font-semibold">Hostel Name - </span>
                {b.hostelName.replace(/_/g, " ")}
              </div>
              <div className="flex items-center">
                <div className="flex flex-col sm:text-base text-sm">
                  <span className="w-full">Check In Date</span>
                  <span>
                    {new Date(b.bookedFromDt.toString()).toLocaleString("en-GB", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })}
                  </span>
                </div>
                <Separator className="mx-2 h-1 w-1/3 text-black sm:w-1/2" />
                <div className="flex flex-col sm:text-base text-sm">
                  <span>Check Out Date</span>
                  {new Date(b.bookedToDt.toString()).toLocaleString("en-GB", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  })}
                </div>
              </div>
              <div className="flex justify-end my-2">
                {b.bookingStatus !== "CANCELED" && b.bookingStatus !== "CHECKOUT" && (
                  <button
                    onClick={() => {
                      updateBookingStatusMutation.mutate({
                        id: b.id,
                        bookingStatus: BookingStatus.CANCELED,
                      });
                    }}
                    className="rounded bg-red-500 p-2 text-sm text-white"
                  >
                    Cancel Booking
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
