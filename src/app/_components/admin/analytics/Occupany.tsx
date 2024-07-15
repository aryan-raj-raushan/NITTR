"use client";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import React, { useState, useMemo, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  format,
  eachDayOfInterval,
  addMonths,
  startOfWeek,
  startOfMonth,
  isToday,
  isAfter,
} from "date-fns";

import { RouterOutputs } from "~/trpc/shared";
import AdminNav from "../AdminNav";
import { IoChevronDownOutline } from "react-icons/io5";

export default function OccupancyReport({
  bookings,
  roomDetails,
}: {
  bookings: RouterOutputs["booking"]["getAllBookings"]["bookings"];
  roomDetails: any[]; // Replace with the actual type of roomDetails
}) {
  const [hostel, setHostel] = useState<any>();

  console.log("bookings", bookings);

  const hostels = useMemo(() => {
    const uniqueHostels = Array.from(
      new Set(roomDetails.map((room) => room.hostelName)),
    );
    return uniqueHostels;
  }, [roomDetails]);

  useEffect(() => {
    if (hostels.length > 0) {
      setHostel(hostels[0]);
    }
  }, [hostels]);
  const [timeframe, setTimeframe] = useState<
    "daily" | "weekly" | "monthly" | "custom"
  >("daily");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const bookingData = useMemo(() => {
    let groupedData = {} as Record<string, number>;

    if (timeframe === "daily") {
      groupedData = bookings.reduce(
        (acc: any, booking: any) => {
          const date = format(new Date(booking.bookingDate), "dd-MM-yyyy");
          if (!acc[date]) {
            acc[date] = 0;
          }
          acc[date]++;
          return acc;
        },
        {} as Record<string, number>,
      );
    } else if (timeframe === "weekly") {
      groupedData = bookings.reduce(
        (acc: any, booking: any) => {
          const weekStart = format(
            startOfWeek(new Date(booking.bookingDate)),
            "dd-MM-yyyy",
          );
          if (!acc[weekStart]) {
            acc[weekStart] = 0;
          }
          acc[weekStart]++;
          return acc;
        },
        {} as Record<string, number>,
      );
    } else if (timeframe === "monthly") {
      groupedData = bookings.reduce(
        (acc: any, booking: any) => {
          const monthStart = format(
            startOfMonth(new Date(booking.bookingDate)),
            "MMMM yyyy",
          );
          if (!acc[monthStart]) {
            acc[monthStart] = 0;
          }
          acc[monthStart]++;
          return acc;
        },
        {} as Record<string, number>,
      );
    }

    return Object.keys(groupedData).map((date) => ({
      date,
      bookings: groupedData[date],
    }));
  }, [bookings, timeframe]);

  // Data transformation for bed availability
  const bedAvailabilityData = useMemo(() => {
    const now = new Date();
    const futureBookings = bookings.filter(
      (booking: any) =>
        new Date(booking.bookedFromDt) >= now &&
        booking.bookingStatus === "CONFIRMED",
    );

    let groupedData: any = {} as Record<string, Record<string, number>>;

    const filteredRoomDetails = roomDetails.filter(
      (room) => room.hostelName === hostel,
    );

    const dates = eachDayOfInterval({ start: now, end: addMonths(now, 1) });
    dates.forEach((date) => {
      const formattedDate = format(date, "dd-MM-yyyy");
      if (!groupedData[formattedDate]) {
        groupedData[formattedDate] = {};
      }

      filteredRoomDetails.forEach((room) => {
        const roomType = room.roomType;
        if (!groupedData[formattedDate][roomType]) {
          groupedData[formattedDate][roomType] = room.totalBed; // Total beds
        }

        futureBookings.forEach((booking: any) => {
          if (
            format(new Date(booking.bookedFromDt), "dd-MM-yyyy") ===
              formattedDate &&
            booking.roomType === roomType &&
            booking.hostelName === hostel
          ) {
            groupedData[formattedDate][roomType] -= booking.bookedBed; // Subtract booked beds
          }
        });
      });
    });

    let transformedData = [];
    for (const date in groupedData) {
      const dateData: any = { date };
      for (const roomType in groupedData[date]) {
        dateData[roomType] = groupedData[date][roomType];
      }
      transformedData.push(dateData);
    }

    return transformedData;
  }, [bookings, timeframe, roomDetails, hostel]);

  const confirmedAndTodayCheckoutBookings = useMemo(() => {
    const today = new Date();

    const filteredBookings = bookings.filter((booking: any) => {
      const bookedToDate = new Date(booking.bookedToDt);
      const bookedFromDate = new Date(booking.bookedFromDt);

      return (
        (booking.bookingStatus === "CONFIRMED" &&
          (isToday(bookedToDate) ||
            isToday(bookedFromDate) ||
            isAfter(bookedFromDate, today) ||
            isAfter(bookedToDate, today))) ||
        (booking.bookingStatus !== "CONFIRMED" &&
          (isToday(bookedToDate) || isToday(bookedFromDate)))
      );
    });

    return filteredBookings.sort((a: any, b: any) => {
      const dateA = new Date(a.bookedFromDt);
      const dateB = new Date(b.bookedFromDt);
      return dateA.getTime() - dateB.getTime();
    });
  }, [bookings]);

  return (
    <TooltipProvider>
      <div className="mx-auto flex min-h-screen w-full max-w-[1280px] flex-col bg-muted/40">
        <div className="flex flex-col sm:gap-4 sm:py-4">
          <main className="flex gap-4">
            <AdminNav />
            <div className="w-full">
              <div className="flex items-center justify-between">
                <div className="px-10 pb-10 pt-5 text-3xl font-medium">
                  Occupancy Report
                </div>
                <div className="relative px-10 pb-5">
                  <label htmlFor="hostel" className="mr-3">
                    Select Hostel:{" "}
                  </label>
                  <div className="relative inline-block">
                    <select
                      id="hostel"
                      value={hostel}
                      onChange={(e) => {
                        setHostel(e.target.value);
                      }}
                      className="w-28 cursor-pointer appearance-none rounded border border-gray-300 px-2 py-1 outline-none"
                      style={{
                        WebkitAppearance: "none",
                        MozAppearance: "none",
                        appearance: "none",
                      }}
                    >
                      {hostels.map((h) => (
                        <option key={h} value={h}>
                          {h}
                        </option>
                      ))}
                    </select>
                  </div>
                  <label htmlFor="timeframe" className="ml-5 mr-3">
                    Select Timeframe:{" "}
                  </label>
                  <div className="relative inline-block">
                    <select
                      id="timeframe"
                      value={timeframe}
                      onChange={(e) => {
                        setTimeframe(
                          e.target.value as "daily" | "weekly" | "monthly",
                        );
                        setIsDropdownOpen(false);
                      }}
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="w-28 cursor-pointer appearance-none rounded border border-gray-300 px-2 py-1 outline-none"
                      style={{
                        WebkitAppearance: "none",
                        MozAppearance: "none",
                        appearance: "none",
                      }}
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                    <span
                      className={`absolute right-3 top-2.5 transition-transform duration-200 ${
                        isDropdownOpen ? "rotate-180" : "rotate-0"
                      }`}
                    >
                      <IoChevronDownOutline />
                    </span>
                  </div>
                </div>
              </div>

              <div className="px-10 pb-10 pt-5 text-2xl font-medium">
                Overall Booking Report
              </div>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={bookingData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="bookings" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>

              <div className="px-10 pb-10 pt-5 text-2xl font-medium">
                Bed Availability Report
              </div>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={bedAvailabilityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="SINGLE_BED" fill="#82ca9d" />
                  <Bar dataKey="DOUBLE_BED" fill="#8884d8" />
                  <Bar dataKey="TRIPLE_BED" fill="#ffc658" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </main>
        </div>
        <div className="mb-10">
          <div className="px-10 pb-10 pt-5 text-2xl font-medium">Booking</div>
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-2 py-2">S.NO</th>
                <th className="border border-gray-300 px-2 py-2">ID</th>
                <th className="border border-gray-300 px-2 py-2">User Name</th>
                <th className="border border-gray-300 px-2 py-2">
                  Hostel Name
                </th>
                <th className="border border-gray-300 px-2 py-2">Room Type</th>
                <th className="border border-gray-300 px-2 py-2">
                  Booked Beds
                </th>
                <th className="border border-gray-300 px-2 py-2">
                  Booking Date
                </th>
                <th className="border border-gray-300 px-2 py-2">
                  Checkout Date
                </th>
                <th className="border border-gray-300 px-2 py-2">
                  Booking Status
                </th>
              </tr>
            </thead>
            <tbody className="text-center">
              {confirmedAndTodayCheckoutBookings.map(
                (booking: any, index: number) => (
                  <tr key={booking.id}>
                    <td className="border border-gray-300 px-2 py-2">
                      {index + 1}
                    </td>
                    <td className="border border-gray-300 px-2 py-2">
                      {booking.id}
                    </td>
                    <td className="border border-gray-300 px-2 py-2">
                      {booking.userName}
                    </td>
                    <td className="border border-gray-300 px-2 py-2">
                      {booking.hostelName.replace(/_/g, " ")}
                    </td>
                    <td className="border border-gray-300 px-2 py-2">
                      {booking.roomType.replace(/_/g, " ")}
                    </td>
                    <td className="border border-gray-300 px-2 py-2">
                      {booking.bookedBed}
                    </td>
                    <td className="border border-gray-300 px-2 py-2">
                      {format(new Date(booking.bookedFromDt), "dd-MM-yyyy")}
                    </td>
                    <td className="border border-gray-300 px-2 py-2">
                      {format(new Date(booking.bookedToDt), "dd-MM-yyyy")}
                    </td>
                    <td className="border border-gray-300 px-2 py-2">
                      {booking.bookingStatus}
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>
      </div>
    </TooltipProvider>
  );
}
