"use client"
import { BookingDetails, GuestHouse } from "@prisma/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { RecentBookings } from "~/app/_components/admin/RecentBookings";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { TbookingsValidator } from "~/utils/validators/bookingValidators";

function formatObject(obj: any, indentLevel = 1) {
  let result = "";
  const indent = "  ".repeat(indentLevel); // Creates an indentation string based on the current recursion depth
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === "object" && value !== null) {
      // If the value is an object, recursively format it
      result += `${indent}${+key + 1}:\n${formatObject(value, indentLevel + 1)}`;
    } else {
      // Otherwise, just append the key-value pair
      result += `${indent}${key}- ${value}\n`;
    }
  }

  return result;
}

const emptyBooking: any = {
  id: "",
  bookingStatus: "UNCONFIRMED",
  hostelName: "SARAN_GUEST_HOUSE",
  updateBy: "",
  createdAt: new Date(),
  updatedAt: new Date(),
  bookingDate: new Date(),
  bookedFromDt: new Date(),
  bookedToDt: new Date(),
  remark: "",
  bookPaymentId: "",
  userId: "",
  guests: [],
  rooms: [],
  amount: 0,
  subtotal: 0,
  bookedBed: 0,
  bookedRoom: "",
  guestsList: [],
  paymentStatus: "",
};

export default function AdminConsole({ bookings, hostelName }: { bookings: TbookingsValidator[], hostelName: GuestHouse }) {
  const [selectedBooking, setSelectedBooking] = useState<BookingDetails>(bookings[0] ?? emptyBooking)
  const router = useRouter();
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            Admin Dashboard
          </h2>
          <div className="hidden md:flex items-center space-x-2">
            <Button><Link href={"/admin/bookings/create"} >Create Booking</Link></Button>
          </div>
        </div>
        <Tabs defaultValue={hostelName ?? "overview"} className="space-y-4">
          <TabsList>
            <TabsTrigger onClick={() => { router.push(`/admin`) }} value="overview">Overview</TabsTrigger>
            <TabsTrigger onClick={() => { router.push(`/admin?hostel=${GuestHouse.SARAN_GUEST_HOUSE}`) }} value={GuestHouse.SARAN_GUEST_HOUSE} >
              Saran
            </TabsTrigger>
            <TabsTrigger onClick={() => { router.push(`/admin?hostel=${GuestHouse.VISHVESHVARAYA_GUEST_HOUSE}`) }} value={GuestHouse.VISHVESHVARAYA_GUEST_HOUSE} >
              Vishveshvaraya
            </TabsTrigger>
            <TabsTrigger onClick={() => { router.push(`/admin?hostel=${GuestHouse.EXECUTIVE_GUEST_HOUSE}`) }} value={GuestHouse.EXECUTIVE_GUEST_HOUSE} >
              Executive
            </TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4 md:col-span-3">
                <CardHeader>
                  <CardTitle>Recent Bookings</CardTitle>
                  <CardDescription>
                    Total {bookings.length} 
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-full">
                  <RecentBookings selectedBooking={selectedBooking} setSelectedBooking={setSelectedBooking} bookings={bookings} />
                </CardContent>
              </Card>

              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Overview</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <pre className="mt-2 w-full rounded-md bg-slate-950 p-4 overflow-auto">
                    {!!bookings.length ?
                      <code className="text-white text-xs md:text-sm">
                        {Object.keys(selectedBooking ?? {}).map((key) => {
                          const value = selectedBooking![key as keyof typeof selectedBooking];
                          const formattedValue = typeof value === 'object' && value !== null
                            ? `\n${formatObject(value)}`
                            : value
                          return key != "guests" && key != "rooms" && <div key={key}>{`${key} - ${formattedValue}`}</div>;
                        })}
                      </code> :
                      <code></code>
                    }
                  </pre>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value={GuestHouse.SARAN_GUEST_HOUSE} className="space-y-4">
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4 md:col-span-3">
                <CardHeader>
                  <CardTitle>Saran Bookings</CardTitle>
                  <CardDescription>
                    Total {bookings.length}
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-full">
                  <RecentBookings selectedBooking={selectedBooking} setSelectedBooking={setSelectedBooking} bookings={bookings} />
                </CardContent>
              </Card>

              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Overview</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <pre className="mt-2 w-full rounded-md bg-slate-950 p-4 overflow-auto">
                    {!!bookings.length ?
                      <code className="text-white text-xs md:text-sm">
                        {Object.keys(selectedBooking ?? {}).map((key) => {
                          const value = selectedBooking![key as keyof typeof selectedBooking];
                          const formattedValue = typeof value === 'object' && value !== null
                            ? `\n${formatObject(value)}`
                            : value
                          return key != "guests" && key != "rooms" && <div key={key}>{`${key} - ${formattedValue}`}</div>;
                        })}
                      </code> :
                      <code></code>
                    }
                  </pre>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value={GuestHouse.VISHVESHVARAYA_GUEST_HOUSE} className="space-y-4">
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4 md:col-span-3">
                <CardHeader>
                  <CardTitle>Vishveshvaraya</CardTitle>
                  <CardDescription>
                    Total {bookings.length}
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-full">
                  <RecentBookings selectedBooking={selectedBooking} setSelectedBooking={setSelectedBooking} bookings={bookings} />
                </CardContent>
              </Card>

              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Overview</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <pre className="mt-2 w-full rounded-md bg-slate-950 p-4 overflow-auto">
                    {!!bookings.length ?
                      <code className="text-white text-xs md:text-sm">
                        {Object.keys(selectedBooking ?? {}).map((key) => {
                          const value = selectedBooking![key as keyof typeof selectedBooking];
                          const formattedValue = typeof value === 'object' && value !== null
                            ? `\n${formatObject(value)}`
                            : value
                          return key != "guests" && key != "rooms" && <div key={key}>{`${key} - ${formattedValue}`}</div>;
                        })}
                      </code> :
                      <code></code>
                    }
                  </pre>
                </CardContent>
              </Card>
            </div>
          </TabsContent>


          <TabsContent value={GuestHouse.EXECUTIVE_GUEST_HOUSE} className="space-y-4">
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4 md:col-span-3">
                <CardHeader>
                  <CardTitle>Executive</CardTitle>
                  <CardDescription>
                    Total {bookings.length}
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-full">
                  <RecentBookings selectedBooking={selectedBooking} setSelectedBooking={setSelectedBooking} bookings={bookings} />
                </CardContent>
              </Card>

              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Overview</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <pre className="mt-2 w-full rounded-md bg-slate-950 p-4 overflow-auto">
                    {!!bookings.length ?
                      <code className="text-white text-xs md:text-sm">
                        {Object.keys(selectedBooking ?? {}).map((key) => {
                          const value = selectedBooking![key as keyof typeof selectedBooking];
                          const formattedValue = typeof value === 'object' && value !== null
                            ? `\n${formatObject(value)}`
                            : value
                          return key != "guests" && key != "rooms" && <div key={key}>{`${key} - ${formattedValue}`}</div>;
                        })}
                      </code> :
                      <code></code>
                    }
                  </pre>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </ScrollArea>
  );
}

