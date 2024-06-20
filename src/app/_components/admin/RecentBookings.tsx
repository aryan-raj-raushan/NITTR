"use client"

import { BookingDetails } from "@prisma/client";
import { useEffect, useState } from "react";
import { api } from "~/trpc/react";
import { useRouter } from 'next/navigation';
import { useSession } from "next-auth/react";
import { Separator } from "~/components/ui/separator";

export function RecentBookings({ bookings, setSelectedBooking, selectedBooking }: { bookings: BookingDetails[], setSelectedBooking: Function, selectedBooking: BookingDetails }) {
  
  const sortedBookings = bookings.sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
  return (
    <div className="space-y-8 overflow-y-scroll no-scrollbar cursor-pointer h-full">
      {sortedBookings.map((b, index) => {
        return (
          <div key={b.id + index} onClick={() => setSelectedBooking(b)} className={`flex items-center p-3 rounded-2xl hover:bg-gray-100 ${selectedBooking.id == b.id ? "bg-gray-100" : ""} border-b border-gray-300`}>
            <div className="w-full flex flex-col gap-2">
              <p className=" flex justify-between">
                <span className="text-lg font-semibold">Booking Id - {b.id}</span>
                <span className={`p-2 rounded-full text-white text-xs ${b.bookingStatus === "CANCELED" ? "bg-red-500" : b.bookingStatus === "UNCONFIRMED" ? "bg-yellow-500" : "bg-green-500"}`}>
                  {b.bookingStatus}
                </span>
              </p>
              <div>
                <span className="font-semibold text-lg">Hostel Name - </span>
                {b.hostelName.replace(/_/g, " ")}
              </div>
              <div className="flex items-center">
                <div className="flex flex-col">
                  <span className="w-full">Check In Date</span>
                  <span>
                    {new Date(b.bookedFromDt.toString()).toLocaleString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })}
                  </span>
                </div>
                <Separator className="text-black h-1 mx-2 sm:w-1/2 w-1/3" />
                <div className="flex flex-col">
                  <span>Check Out Date</span>
                  {new Date(b.bookedToDt.toString()).toLocaleString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
