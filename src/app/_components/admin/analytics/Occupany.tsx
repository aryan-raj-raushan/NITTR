"use client";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import React, { useState, useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { format, startOfWeek, startOfMonth } from 'date-fns';

import { RouterOutputs } from "~/trpc/shared";
import AdminNav from "../AdminNav";
import { IoChevronDownOutline } from "react-icons/io5";

export default function OccupancyReport({
  bookings,
}: {
  bookings: RouterOutputs["booking"]["getAllBookings"]["bookings"];
}) {
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Data transformation based on the selected timeframe
  const data = useMemo(() => {
    let groupedData = {} as Record<string, number>;

    if (timeframe === 'daily') {
      groupedData = bookings.reduce((acc:any, booking:any) => {
        const date = format(new Date(booking.bookingDate), 'dd-MM-yyyy');
        if (!acc[date]) {
          acc[date] = 0;
        }
        acc[date]++;
        return acc;
      }, {} as Record<string, number>);
    } else if (timeframe === 'weekly') {
      groupedData = bookings.reduce((acc:any, booking:any) => {
        const weekStart = format(startOfWeek(new Date(booking.bookingDate)), 'dd-MM-yyyy');
        if (!acc[weekStart]) {
          acc[weekStart] = 0;
        }
        acc[weekStart]++;
        return acc;
      }, {} as Record<string, number>);
    } else if (timeframe === 'monthly') {
      groupedData = bookings.reduce((acc:any, booking:any) => {
        const monthStart = format(new Date(booking.bookingDate), 'MMMM yyyy');
        if (!acc[monthStart]) {
          acc[monthStart] = 0;
        }
        acc[monthStart]++;
        return acc;
      }, {} as Record<string, number>);
    }

    return Object.keys(groupedData).map(date => ({
      date,
      bookings: groupedData[date],
    }));
  }, [bookings, timeframe]);

  return (
    <TooltipProvider>
      <div className="mx-auto flex min-h-screen w-full max-w-[1280px] flex-col bg-muted/40">
        <div className="flex flex-col sm:gap-4 sm:py-4">
          <main className="flex gap-4">
            <AdminNav />
            <div className="w-full">
              <div className="flex items-center justify-between">
              <div className="px-10 text-3xl font-medium pt-5 pb-10">
                Occupancy Report
              </div>
              <div className="px-10 pb-5 relative">
                <label htmlFor="timeframe" className="mr-3">Select Timeframe: </label>
                <div className="relative inline-block">
                  <select
                    id="timeframe"
                    value={timeframe}
                    onChange={(e) => {
                      setTimeframe(e.target.value as 'daily' | 'weekly' | 'monthly');
                      setIsDropdownOpen(false);
                    }}
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="px-4 py-1 w-28 cursor-pointer border border-gray-300 rounded appearance-none outline-none"
                    style={{ WebkitAppearance: "none", MozAppearance: "none", appearance: "none" }}
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                  <span
                    className={`absolute right-3 top-2.5 duration-200 transition-transform ${
                      isDropdownOpen ? 'rotate-180' : 'rotate-0'
                    }`}
                  >
                    <IoChevronDownOutline/>
                  </span>
                </div>
              </div>
              </div>
              
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip  />
                  <Legend />
                  <Bar dataKey="bookings" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
}
