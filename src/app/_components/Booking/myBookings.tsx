"use client";
import { RecentBookings } from "~/app/_components/admin/RecentBookings";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Tabs, TabsContent } from "~/components/ui/tabs";
import { useEffect, useState } from "react";
import SingleBookingsCard from "./singleBookingCard";
import { emptyBooking } from "~/utils/validators/bookingValidators";
// @ts-ignore
import { BookingStatus, GuestHouse } from "@prisma/client";

interface Guest {
  name: string;
  email: string;
  mobileNo: string;
}

interface Room {
  ac: boolean;
  cleaningStatus: string;
  geaser: boolean;
  floor: string;
  roomType: string;
}

interface BookingDetails {
  id: string;
  bookingStatus: BookingStatus;
  hostelName: GuestHouse;
  updateBy: string;
  createdAt: Date;
  updatedAt: Date;
  bookingDate: Date;
  guests: Guest[];
  rooms: Room[];
  userId: string | null;
  bookedFromDt: Date;
  bookedToDt: Date;
  remark: string;
  bookPaymentId: string;
}

export default function MyBookings({ bookings }: { bookings: BookingDetails[] }) {
  const [initialBookings, setInitialBookings] = useState<BookingDetails[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<BookingDetails | null>(null);
  const [filteredBookings, setFilteredBookings] = useState<BookingDetails[]>([]);
  const [filter, setFilter] = useState<BookingStatus | "ALL">("ALL");
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [bookingsToShow, setBookingsToShow] = useState<number>(10);

  useEffect(() => {
    setInitialBookings(bookings);
    setFilteredBookings(bookings);
    setSelectedBooking(bookings.length > 0 ? bookings[0] as BookingDetails : null);

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, [bookings]);

  useEffect(() => {
    if (filter === "ALL") {
      setFilteredBookings(initialBookings);
    } else {
      setFilteredBookings(initialBookings.filter(booking => booking.bookingStatus === filter));
    }
  }, [filter, initialBookings]);

  const handleFilterChange = (status: BookingStatus | "ALL") => {
    setFilter(status);
  };

  const handleEntriesChange = (entries: number) => {
    setBookingsToShow(entries);
  };

  const lastConfirmedBooking =
    initialBookings.find((booking: BookingDetails) => booking.bookingStatus === "CONFIRMED") ||
    initialBookings[initialBookings.length - 1];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  const generateSystematicId = (id: string, index: number) => {
    // Extract the first 3 letters of the original booking ID
    const prefix = id.substring(0, 5).toUpperCase();
    
    // Generate the systematic ID with the prefix and the sequential number
    return `${prefix}`;
  };
  

  const filteredBookingsToShow = filteredBookings.slice(0, bookingsToShow);

  return (
    <>
      {initialBookings.length > 0 ? (
        <div className="mx-auto h-full max-w-[1280px] px-10">
          <div className="flex-1 space-y-4 py-4 md:py-12">
            <div className="flex items-center justify-between space-y-2">
              <h2 className="text-3xl font-bold tracking-tight">My Bookings</h2>
            </div>
            <SingleBookingsCard booking={lastConfirmedBooking ?? emptyBooking} />

            <Tabs defaultValue="overview" className="space-y-4">
              <TabsContent value="overview" className="h-full space-y-4">
                <div className="flex sm:flex-row flex-col gap-4">
                  <Card className="sm:w-1/2 w-full ">
                    <CardHeader>
                      <CardTitle className="text-gray-500">
                        Recent Bookings :
                        <span className="pl-1 text-xl">{initialBookings.length}</span>
                      </CardTitle>
                      <div className="flex space-x-2 mt-4">
                        <button
                          onClick={() => handleFilterChange("ALL")}
                          className={`rounded p-2 text-sm ${filter === "ALL" ? "bg-blue-500 text-white" : "bg-gray-200 text-black"}`}
                        >
                          All
                        </button>
                        <button
                          onClick={() => handleFilterChange(BookingStatus.UNCONFIRMED)}
                          className={`rounded p-2 text-sm ${filter === BookingStatus.UNCONFIRMED ? "bg-blue-500 text-white" : "bg-gray-200 text-black"}`}
                        >
                          Pending
                        </button>
                        <button
                          onClick={() => handleFilterChange(BookingStatus.CONFIRMED)}
                          className={`rounded p-2 text-sm ${filter === BookingStatus.CONFIRMED ? "bg-blue-500 text-white" : "bg-gray-200 text-black"}`}
                        >
                          Confirmed
                        </button>
                        <button
                          onClick={() => handleFilterChange(BookingStatus.CANCELED)}
                          className={`rounded p-2 text-sm ${filter === BookingStatus.CANCELED ? "bg-blue-500 text-white" : "bg-gray-200 text-black"}`}
                        >
                          Cancelled
                        </button>
                      </div>
                      <div className="mt-4">
                        <label htmlFor="entries" className="text-sm font-medium text-gray-700">
                          Show Entries:
                        </label>
                        <select
                          id="entries"
                          className="ml-2 p-1 bg-gray-200 text-black rounded"
                          onChange={(e) => handleEntriesChange(Number(e.target.value))}
                          defaultValue={10}
                        >
                          <option value={10}>10</option>
                          <option value={20}>20</option>
                          <option value={50}>50</option>
                          <option value={100}>100</option>
                        </select>
                      </div>
                    </CardHeader>
                    <CardContent className="my-4">
                      <RecentBookings
                        selectedBooking={selectedBooking ?? emptyBooking}
                        setSelectedBooking={setSelectedBooking}
                        bookings={filteredBookingsToShow as any}
                      />
                      {bookingsToShow < filteredBookings.length && (
                        <button
                          onClick={() => handleEntriesChange(bookingsToShow + 10)}
                          className="mt-4 p-2 bg-blue-500 text-white rounded"
                        >
                          Load More
                        </button>
                      )}
                    </CardContent>
                  </Card>

                  <Card className={`sticky top-8 col-span-4 h-fit ${isMobile ? "hidden" : ""}`}>
                    <CardContent className="pl-2 max-h-[500px] overflow-y-auto">
                      {selectedBooking && (
                        <div className="space-y-5 p-4 text-xs text-black md:text-sm">
                          <CardTitle className="pt-6">Overview</CardTitle>
                          <div>
                            <span className="key-style text-lg font-medium">
                              ID :{" "}
                            </span>
                            <span className="value-style sm:text-base text-sm">
                              {generateSystematicId(selectedBooking?.id, initialBookings.findIndex(booking => booking.id === selectedBooking.id))}
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
                              {formatDate(selectedBooking?.bookingDate.toString())}
                            </span>
                          </div>
                          <div>
                            <span className="key-style text-lg font-medium">
                              Guest Details{" "}
                            </span>
                            <div className="value-style w-fit rounded-md bg-gray-200 p-2 px-4 text-lg">
                              {selectedBooking?.guests.map(
                                (guest: Guest, index: number) => (
                                  <div
                                    key={index}
                                    className="bg-white shadow rounded-md p-4 border border-gray-200"
                                  >
                                    <div className="flex flex-col items-start space-y-2">
                                      <div className="w-full">
                                        <span className="block font-semibold text-base">Name:</span>
                                        <span className="block text-gray-700 text-base">{guest.name}</span>
                                      </div>
                                      <div className="w-full">
                                        <span className="block font-semibold text-base">Email:</span>
                                        <span className="block text-gray-700 text-base">{guest.email}</span>
                                      </div>
                                      <div className="w-full">
                                        <span className="block font-semibold text-base">Phone Number:</span>
                                        <span className="block text-gray-700 text-base">{guest.mobileNo}</span>
                                      </div>
                                    </div>
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
                                (room: Room, index: number) => (
                                  <div
                                    key={index}
                                    className="flex flex-col justify-between gap-2"
                                  >
                                    <span className="value-style">
                                      AC : {room.ac ? "Yes" : "No"}
                                    </span>
                                    <span className="value-style">
                                      Cleaning Status : {room.cleaningStatus}
                                    </span>
                                    <span className="value-style">
                                      Geaser : {room.geaser ? "Yes" : "No"}
                                    </span>
                                    <span className="value-style">
                                      Floor : {room.floor.replace(/_/g, " ")}
                                    </span>
                                    <span className="value-style">
                                      Room Type : {room.roomType.replace(/_/g, " ")}
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
        </div>
      ) : (
        <div className="flex items-center justify-center min-h-[60vh]">Loading...</div>
      )}

      {/* Modal for mobile view */}
      {isMobile && selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={() => setSelectedBooking(null)}>
          <div className="bg-white p-4 rounded-lg max-w-sm w-full sm:max-h-full max-h-72 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <CardTitle className=" pt-6">Overview</CardTitle>
            <div className="space-y-5 p-4 text-xs text-black md:text-sm">
              <div>
                <span className="key-style text-lg font-medium">
                  ID :{" "}
                </span>
                <span className="value-style sm:text-base text-sm">
                  {generateSystematicId(selectedBooking?.id, initialBookings.findIndex(booking => booking.id === selectedBooking.id))}
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
                  {formatDate(selectedBooking?.bookingDate.toString())}
                </span>
              </div>
              <div>
                <span className="key-style text-lg font-medium">
                  Guest Details{" "}
                </span>
                <div className="value-style w-fit rounded-md bg-gray-200 p-2 px-4 text-lg">
                  {selectedBooking?.guests.map(
                    (guest: Guest, index: number) => (
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
                    (room: Room, index: number) => (
                      <div
                        key={index}
                        className="flex flex-col justify-between gap-2"
                      >
                        <span className="value-style">
                          AC : {room.ac ? "Yes" : "No"}
                        </span>
                        <span className="value-style">
                          Cleaning Status : {room.cleaningStatus}
                        </span>
                        <span className="value-style">
                          Geaser : {room.geaser ? "Yes" : "No"}
                        </span>
                        <span className="value-style">
                          Floor : {room.floor.replace(/_/g, " ")}
                        </span>
                        <span className="value-style">
                          Room Type : {room.roomType.replace(/_/g, " ")}
                        </span>
                      </div>
                    ),
                  )}
                </div>
              </div>
            </div>
            <button onClick={() => setSelectedBooking(null)} className="mt-4 p-2 bg-blue-500 text-white rounded">Close</button>
          </div>
        </div>
      )}
    </>
  );
}
