"use client"
import { RecentBookings } from "~/app/_components/admin/RecentBookings";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Tabs, TabsContent } from "~/components/ui/tabs";
import { useState } from "react";
import SingleBookingsCard from "./singleBookingCard";
import { emptyBooking } from "~/utils/validators/bookingValidators";

export default function MyBookings({ bookings }: any) {
  const [selectedBooking, setSelectedBooking] = useState<any>(bookings[0]);
  const lastConfirmedBooking = bookings.find(
    (booking: any) => booking.bookingStatus === "CONFIRMED"
  ) || bookings[bookings.length - 1];

  const formatDate = (dateString: any) => {
    const date = new Date(dateString);
    return date.toLocaleString(); // Adjust this to your preferred date format
  };

  return (
    <div className="h-full max-w-[1280px] mx-auto">
      <div className="flex-1 space-y-4 py-4 md:py-12">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">My Bookings</h2>
        </div>
        <SingleBookingsCard
          booking={lastConfirmedBooking ?? emptyBooking}
        ></SingleBookingsCard>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsContent value="overview" className="space-y-4 h-full">
            <div className="flex gap-4">
       
                <Card className="w-1/2 ">
                  <CardHeader>
                    <CardTitle>Recent Bookings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RecentBookings
                      selectedBooking={selectedBooking}
                      setSelectedBooking={setSelectedBooking}
                      bookings={bookings}
                    />
                  </CardContent>
                </Card>

                <Card className="sticky top-8 col-span-4 h-fit ">
                  <CardContent className="pl-2">
                    <div className="space-y-5 p-4 text-xs text-black md:text-sm">
                      <CardTitle className=" pt-6">Overview</CardTitle>
                      <div>
                        <span className="key-style text-lg font-medium">
                          ID :{" "}
                        </span>
                        <span className="value-style text-lg">
                          {selectedBooking.id}
                        </span>
                      </div>
                      <div>
                        <span className="key-style text-lg font-medium">
                          Hostel Name :{" "}
                        </span>
                        <span className="value-style text-lg ">
                          {selectedBooking.hostelName.replace(/_/g, " ")}
                        </span>
                      </div>

                      <div>
                        <span className="key-style text-lg font-medium">
                          Booking Date :{" "}
                        </span>
                        <span className="value-style text-lg ">
                          {formatDate(selectedBooking.bookingDate)}
                        </span>
                      </div>
                      <div>
                        <span className="key-style text-lg font-medium">
                          Guest Details{" "}
                        </span>
                        <div className="value-style w-fit rounded-md bg-gray-200 p-2 px-4 text-lg">
                          <div className="flex justify-between gap-2">
                            <span className="value-style">Name</span>
                            <span className="value-style">Email</span>
                            <span className="value-style">Phone number</span>
                          </div>
                          {selectedBooking?.guests.map(
                            (guest: any, index: any) => (
                              <div
                                key={index}
                                className="flex justify-between gap-6"
                              >
                                <span className="value-style">
                                  {guest.name}
                                </span>
                                <span className="value-style">
                                  {guest.email}
                                </span>
                                <span className="value-style">
                                  {guest.mobileNo}
                                </span>
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                      <div>
                        <span className="key-style text-lg font-medium">
                          Room Details{" "}
                        </span>
                        <div className="value-style w-full rounded-md bg-gray-200 p-2 px-4 text-lg">
                          {selectedBooking?.rooms.map(
                            (guest: any, index: any) => (
                              <div
                                key={index}
                                className="flex flex-col justify-between gap-2"
                              >
                                <span className="value-style">
                                  AC : {guest.ac}
                                </span>
                                <span className="value-style">
                                  Cleaning Status : {guest.cleaningStatus}
                                </span>
                                <span className="value-style">
                                  Geaser : {guest.geaser}
                                </span>
                                <span className="value-style">
                                  Floor : {guest.floor.replace(/_/g, " ")}
                                </span>
                                <span className="value-style">
                                  Room Type :{" "}
                                  {guest.roomType.replace(/_/g, " ")}
                                </span>
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
