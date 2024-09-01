'use client'

// import { useEffect } from 'react';
import { Card } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import PrintButton from "./PrintButton";
import { useAppSelector } from "~/store";

interface BookingConfirmedProps {
  booking: any;
}

const BookingConfirmed = ({ booking }: BookingConfirmedProps) => {
  const session = useAppSelector((store: any) => store.auth);
  const numberOfGuests = booking.guests.length;

  const checkInDate = new Date(booking.bookedFromDt);
  const checkOutDate = new Date(booking.bookedToDt);

  return (
    <div className="mx-auto my-10 flex max-w-[1280px] flex-col gap-10 px-5 sm:px-5">
      <Card className="flex flex-col gap-10 p-4 shadow-2xl">
        <div id="receipt-content">
          <div className="flex flex-col justify-between sm:flex-row">
            <div className="w-full p-5 sm:w-1/2">
              <span className="text-lg font-bold sm:text-2xl">
                Booking Details
              </span>
              <div className="mt-3 flex justify-between pr-10 text-sm sm:text-lg ">
                <span>Check-in Date</span>
                <span className="">
                  {checkInDate.toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  })}{" "}
                </span>
                <span className="">{checkInDate.toLocaleTimeString()}</span>
              </div>
              <div className="mt-3 flex justify-between pr-10 text-sm sm:text-lg">
                <span>Check-out Date</span>
                <span className="">
                  {checkOutDate.toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  })}
                </span>
                <span className="">{checkOutDate.toLocaleTimeString()}</span>
              </div>
              <div className="mt-3 flex justify-between pr-10 text-sm sm:text-lg ">
                <span>Guests</span>
                <span className="pr-10">
                  {numberOfGuests} {numberOfGuests > 1 ? "Persons" : "Person"}
                </span>
                <span>&nbsp;</span>
              </div>
              <div className="mt-3 flex justify-between pr-10 text-sm sm:text-lg">
                <div className="">Hostel Name</div>
                <div className="">{booking.hostelName?.replace(/_/g, " ")}</div>
                <span>&nbsp;</span>
              </div>
            </div>
            <div className="flex w-full flex-col items-center justify-center sm:w-1/2">
              <div className="mb-1 text-xl sm:text-3xl">
                Status :{" "}
                <span className="text-lg font-extrabold sm:text-2xl">
                  {booking.bookingStatus === "UNCONFIRMED"
                    ? "Awaiting Confirmation"
                    : booking.bookingStatus}
                </span>{" "}
              </div>
              <div className="text-xl text-green-500 sm:text-3xl">
                Great! Your stay is booked
              </div>
              <div className="text-center text-sm font-light sm:text-lg">
                You'll soon receive a confirmation email after the room is
                confirmed
              </div>
            </div>
          </div>
          <Separator></Separator>
          <div className="flex flex-col p-5 sm:flex-row ">
            <div className="flex w-full flex-col gap-0 sm:w-1/2 sm:gap-2">
              <div className="text-xl font-semibold">Booked By</div>
              <div className="">{session?.name}</div>
              <div className="">{booking.guests[0]?.mobileNo}</div>
              <div className="">{session?.email}</div>
            </div>
            <div className="flex w-full flex-col gap-2 sm:w-1/2">
              <div className="flex gap-2 sm:gap-20">
                <div className="text-base font-semibold sm:text-xl">
                  Booking Id
                </div>
                <div className="ml-4 text-sm sm:text-base">{booking.id}</div>
              </div>
              <div className="flex gap-16">
                <span className="text-base font-semibold sm:text-xl">
                  Booking Date
                </span>
                <div className="ml-2 text-sm sm:text-base">
                  {new Date(booking.bookingDate).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  })}
                </div>
              </div>
              <div className="flex gap-10">
                <span className="text-base font-semibold sm:text-xl">
                  Payment Method
                </span>
                <div className="text-sm font-medium uppercase underline sm:text-lg">
                  {booking.paymentMode === "online"
                    ? "Online"
                    : "Pay at the hotel"}
                </div>
              </div>
            </div>
          </div>
          <Separator></Separator>
          <div className="mt-2 rounded-lg border border-gray-300 sm:mt-0">
            <div>
              <div className="flex h-10 items-center  justify-between rounded-t-lg bg-blue-100 px-5 text-lg">
                <span>Description</span>
                <span>Total</span>
              </div>
              <div>
                <div className="flex flex-col p-5">
                  {booking.guests.map((guest: any) => (
                    <div
                      key={guest.id}
                      className="flex justify-between text-sm sm:text-lg"
                    >
                      <span>
                        {guest.name} - {guest.typeOrg.replace(/_/g, " ")}
                      </span>
                    </div>
                  ))}
                  <span className="flex items-end justify-end font-semibold">
                    ₹{booking.subtotal}
                  </span>
                </div>
              </div>
              <div className="flex justify-end gap-10 rounded-b-lg border-t-2 border-gray-300 bg-yellow-100 p-2 text-lg ">
                <span>Total Amount (including taxes)</span>
                <span className="mr-2 font-semibold">₹{booking.amount}</span>
              </div>
            </div>
          </div>
        </div>
        <PrintButton booking={booking} session={session} />
      </Card>
    </div>
  );
}

export default BookingConfirmed;