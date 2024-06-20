"use client";
import React, { PureComponent } from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ZAxis,
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
export default function OccupancyReport({
  bookings,
  month,
}: {
  bookings: RouterOutputs["booking"]["getAllBookings"]["bookings"];
  month: number;
}) {
  const router = useRouter();
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40 p-10">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <div className="h-[30rem] w-[100%] space-y-5">
          <div className="flex items-center justify-center">
            <Select
              defaultValue={month.toString()}
              onValueChange={(v) => {
                router.push(`/admin/occupancy-report?month=${+v}`);
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Months</SelectLabel>
                  {months.map((m, i) => {
                    return (
                      <SelectItem key={i.toString()} value={i.toString()}>
                        {m}
                      </SelectItem>
                    );
                  })}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <ResponsiveContainer width="100%" height={400}>
            <ScatterChart
              margin={{
                top: 20,
                right: 20,
                bottom: 20,
                left: 20,
              }}
            >
              <CartesianGrid />
              <XAxis type="number" dataKey="x" allowDecimals={false} />
              <YAxis type="number" dataKey="y" allowDecimals={false} />
              <Tooltip cursor={{ strokeDasharray: "3 3" }} />
              <Scatter
                name="A school"
                data={bookings.map(
                  ({ bookedFromDt, bookedToDt, bookingDate }) => {
                    return {
                      x: bookingDate.getDate(),
                      y: bookingDate.getHours(),
                    };
                  },
                )}
                fill="#8884d8"
              />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
