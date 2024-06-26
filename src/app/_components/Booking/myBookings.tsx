"use client";
import { RecentBookings } from "~/app/_components/admin/RecentBookings";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Tabs, TabsContent } from "~/components/ui/tabs";
import { useEffect, useState } from "react";
import SingleBookingsCard from "./singleBookingCard";
import { emptyBooking } from "~/utils/validators/bookingValidators";

export default function MyBookings({ bookings }: any) {
  const [initialBookings, setInitialBookings] = useState<any>([]);
  useEffect(() => {
    setInitialBookings(bookings);
  }, []);

  const [selectedBooking, setSelectedBooking] = useState<any>(initialBookings[0]);
  const lastConfirmedBooking =
    initialBookings.find((booking: any) => booking.bookingStatus === "CONFIRMED") ||
    initialBookings[initialBookings.length - 1];
  const formatDate = (dateString: any) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  const TotalBookings = initialBookings.length > 0 && initialBookings.length;

  return (
    <>
    {initialBookings.length>0 ? <div className="mx-auto h-full max-w-[1280px] px-10">
      <div className="flex-1 space-y-4 py-4 md:py-12">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">My Bookings</h2>
        </div>
        <SingleBookingsCard
          booking={lastConfirmedBooking ?? emptyBooking}
        ></SingleBookingsCard>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsContent value="overview" className="h-full space-y-4">
            <div className="flex sm:flex-row flex-col gap-4">
              <Card className="sm:w-1/2 w-full ">
                <CardHeader>
                  <CardTitle className="text-gray-500">
                    Recent Bookings :
                    <span className="pl-1 text-xl">{TotalBookings}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="my-4">
                  <RecentBookings
                    selectedBooking={selectedBooking}
                    setSelectedBooking={setSelectedBooking}
                    bookings={bookings}
                  />
                </CardContent>
              </Card>

              <Card className="sticky top-8 col-span-4 h-fit ">
                <CardContent className="pl-2">
                  {selectedBooking && (
                    <div className="space-y-5 p-4 text-xs text-black md:text-sm">
                    <CardTitle className=" pt-6">Overview</CardTitle>
                    <div>
                      <span className="key-style text-lg font-medium">
                        ID :{" "}
                      </span>
                      <span className="value-style sm:text-base text-sm">
                        {selectedBooking?.id}
                      </span>
                    </div>
                    <div>
                      <span className="key-style text-lg font-medium">
                        Hostel Name :{" "}
                      </span>
                      <span className="value-style sm:text-base text-sm ">
                        {selectedBooking?.hostelName.replace(/_/g, " ")}
                      </span>
                    </div>

                    <div>
                      <span className="key-style text-lg font-medium">
                        Booking Date :{" "}
                      </span>
                      <span className="value-style sm:text-base text-sm ">
                        {formatDate(selectedBooking?.bookingDate)}
                      </span>
                    </div>
                    <div>
                      <span className="key-style text-lg font-medium">
                        Guest Details{" "}
                      </span>
                      <div className="value-style w-fit rounded-md bg-gray-200 p-2 px-4 text-lg">
                        <div className="sm:flex hidden justify-between gap-2 ">
                          <span className="value-style">Name</span>
                          <span className="value-style">Email</span>
                          <span className="value-style">Phone number</span>
                        </div>
                        {selectedBooking?.guests.map(
                          (guest: any, index: any) => (
                            <div
                              key={index}
                              className="flex sm:flex-row flex-col justify-between sm:gap-6 gap-2 sm:border-none border-b border-black pb-2"
                            >
                              <span className="value-style sm:text-base text-sm">{guest.name}</span>
                              <span className="value-style sm:text-base text-sm">{guest.email}</span>
                              <span className="value-style sm:text-base text-sm">
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
                                Room Type : {guest.roomType.replace(/_/g, " ")}
                              </span>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  </div>
                  )}
                  
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div> : <div className="flex items-center justify-center min-h-[60vh]">Loading...</div>}
    </>
    
  );
}
