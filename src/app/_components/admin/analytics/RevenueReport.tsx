"use client";
import React, { useState, useMemo } from "react";
import {
  ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { format, startOfWeek } from 'date-fns';
import { IoChevronDownOutline } from "react-icons/io5";

import { RouterOutputs } from "~/trpc/shared";
import AdminNav from "../AdminNav";

export default function RevenueReport({
  bookings,
}: {
  bookings: RouterOutputs["booking"]["getAllBookings"]["bookings"];
}) {
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Data transformation based on the selected timeframe
  const data = useMemo(() => {
    let groupedData:any = {} as Record<string, { revenue: number; roomBookings: number; }>;

    if (timeframe === 'daily') {
      groupedData = bookings.reduce((acc:any, booking:any) => {
        const date = format(new Date(booking.bookingDate), 'dd-MM-yyyy');
        if (!acc[date]) {
          acc[date] = { revenue: 0, roomBookings: 0 };
        }
        acc[date].revenue += booking.amount;
        acc[date].roomBookings++;
        return acc;
      }, {} as Record<string, { revenue: number; roomBookings: number; }>);
    } else if (timeframe === 'weekly') {
      groupedData = bookings.reduce((acc:any, booking:any) => {
        const weekStart = format(startOfWeek(new Date(booking.bookingDate)), 'dd-MM-yyyy');
        if (!acc[weekStart]) {
          acc[weekStart] = { revenue: 0, roomBookings: 0 };
        }
        acc[weekStart].revenue += booking.amount;
        acc[weekStart].roomBookings++;
        return acc;
      }, {} as Record<string, { revenue: number; roomBookings: number; }>);
    } else if (timeframe === 'monthly') {
      groupedData = bookings.reduce((acc:any, booking:any) => {
        const monthStart = format(new Date(booking.bookingDate), 'MMMM yyyy');
        if (!acc[monthStart]) {
          acc[monthStart] = { revenue: 0, roomBookings: 0 };
        }
        acc[monthStart].revenue += booking.amount;
        acc[monthStart].roomBookings++;
        return acc;
      }, {} as Record<string, { revenue: number; roomBookings: number; }>);
    }

    return Object.keys(groupedData).map((date:any) => ({
      date,
      revenue: groupedData[date].revenue,
      roomBookings: groupedData[date].roomBookings,
    }));
  }, [bookings, timeframe]);

  // Determine the maximum value of room bookings for adjusting y-axis
  const maxRoomBookings = useMemo(() => {
    return Math.max(...data.map(entry => entry.roomBookings));
  }, [data]);

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[1280px] flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4">
        <main className="flex gap-4">
          <AdminNav />
          <div className="w-full">
            <div className="flex items-center justify-between">
              <div className="px-10 text-3xl font-medium pt-5 pb-10">
                Revenue Report
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
              <ComposedChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="revenue" />
                <YAxis yAxisId="roomBookings" orientation="right" domain={[0, maxRoomBookings + 1]} /> {/* Adjusted y-axis domain to start from 0 */}
                <Tooltip />
                <Legend />
                <Bar dataKey="revenue" fill="#82ca9d" name="Revenue" yAxisId="revenue" />
                <Line type="monotone" dataKey="roomBookings" stroke="#ffc658" name="Room Bookings" yAxisId="roomBookings">
                  {/* Custom label for room bookings */}
                  {data.map((entry, index) => (
                    <text
                      key={index}
                      x={index * 30} // Adjust the positioning of labels as per your requirement
                      y={entry.roomBookings} // Adjust the positioning of labels as per your requirement
                      dy={entry.roomBookings > 0 ? -10 : 20} // Adjust the positioning of labels as per your requirement
                      fill="#ffc658" // Color of the label
                      textAnchor="middle"
                    >
                      {entry.roomBookings}
                    </text>
                  ))}
                </Line>
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </main>
      </div>
    </div>
  );
}
