// BookingConfirmed.tsx
import { Card } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { getServerAuthSession } from "~/server/auth";
import PrintButton from "./PrintButton";

export default async function BookingConfirmed({ booking }: any) {

  const session = await getServerAuthSession();

  const numberOfGuests = booking.guests.length;
  const roomRentPerDay = 500;

  const checkInDate = new Date(booking.bookedFromDt);
  const checkOutDate = new Date(booking.bookedToDt);

  const totalAmount = booking.amount;

  return (
    <div className="mx-auto my-10 flex max-w-[1280px] flex-col gap-10">
      <Card className="flex flex-col gap-10 p-4 shadow-2xl">
        <div id="receipt-content">
          <div className="flex justify-between">
            <div className="w-1/2 p-5">
              <span className="text-2xl font-bold">Booking Details</span>
              <div className="mt-3 flex justify-between pr-10 text-lg">
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
              <div className="mt-3 flex justify-between pr-10 text-lg">
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
              <div className="mt-3 flex justify-between pr-10 text-lg ">
                <span>Guests</span>
                <span className="pr-10">
                  {numberOfGuests} {numberOfGuests > 1 ? "Persons" : "Person"}
                </span>
                <span>&nbsp;</span>
              </div>
              <div className="mt-3 flex justify-between pr-10 text-lg">
                <div className="">Hostel Name</div>
                <div className="">{booking.hostelName?.replace(/_/g, " ")}</div>
                <span>&nbsp;</span>
              </div>
            </div>
            <div className="flex w-1/2 flex-col items-center justify-center">
              <div className="text-3xl mb-1">
                Status :{" "}
                <span className="text-2xl font-extrabold">
                  {booking.bookingStatus === "UNCONFIRMED" ? "Awaiting Confirmation" : "Pending"}
                </span>{" "}
              </div>
              <div className="text-3xl text-green-500">
                Great! Your stay is booked
              </div>
              <div className="font-light">
                You'll soon receive a confirmation email after the room is
                confirmed
              </div>
            </div>
          </div>
          <Separator></Separator>
          <div className="flex p-5">
            <div className="flex w-1/2 flex-col gap-2">
              <div className="text-xl font-semibold">Booked By</div>
              <div className="">{session?.user.name}</div>
              <div className="">{booking.guests[0]?.mobileNo}</div>
              <div className="">{session?.user.email}</div>
            </div>
            <div className="flex w-1/2 flex-col gap-2">
              <div className="flex gap-20">
                <div className="text-xl font-semibold">Booking Id</div>
                <div className="ml-4">{booking.id}</div>
              </div>
              <div className="flex gap-16">
                <span className="text-xl font-semibold">Booking Date</span>
                <div className="ml-2">
                  {new Date(booking.bookingDate).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  })}
                </div>
              </div>
              <div className="flex gap-10">
                <span className="text-xl font-semibold">Payment Method</span>
                <div className="text-lg font-medium uppercase underline">
                  Pay at hotel
                </div>
              </div>
            </div>
          </div>
          <Separator></Separator>
          <div className="rounded-lg border border-gray-300">
            <div>
              <div className="flex h-10 items-center  justify-between rounded-t-lg bg-blue-100 px-5 text-lg">
                <span>Description</span>
                <span>Total</span>
              </div>
              <div>
                <div className="flex flex-col p-5">
                  {booking.guests.map((guest: any) => (
                    <div key={guest.id} className="text-lg flex justify-between">
                      <span>{guest.name} - {guest.typeOrg.replace(/_/g, " ")}</span>
                     
                    </div>
                  ))}
                   <span className="font-semibold flex items-end justify-end">₹{booking.subtotal}</span>
                </div>
              </div>
              <div className="flex justify-end gap-10 rounded-b-lg border-t-2 border-gray-300 bg-yellow-100 p-2 text-lg ">
                <span>Total Amount (including taxes)</span>
                <span className="font-semibold mr-2">₹{booking.amount}</span>
              </div>
            </div>
          </div>
        </div>
        <PrintButton booking={booking} session={session} />
      </Card>
    </div>
  );
}