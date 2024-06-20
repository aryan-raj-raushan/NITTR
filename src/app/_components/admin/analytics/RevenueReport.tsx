"use client";
import React, { PureComponent } from "react";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { RouterOutputs } from "~/trpc/shared";
import Link from "next/link";
import { useRouter } from "next/navigation";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
export default function RevenueReport({
  bookings,
}: {
  bookings: RouterOutputs["booking"]["getAllBookings"]["bookings"];
}) {
  const data = months.map((m, i) => {
    return {
      name: m,
      amt: bookings.reduce((a, c) => {
        if (c.bookingDate.getMonth() == i) {
          return a + 1;
        } else return a;
      }, 0),
    };
  });
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40 p-10">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <div className="h-[30rem] w-[100%] space-y-5">
          <div className="flex items-center justify-center"></div>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart width={150} height={40} data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Bar dataKey="amt" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
