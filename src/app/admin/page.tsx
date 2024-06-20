import { api } from "~/trpc/server";
import { GuestHouse } from "@prisma/client";
import AdminDashboardV2 from "../_components/admin/AdminConsoleV2";
import { removeUnderscore } from "~/lib/utils";

export default async function Page({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const hostelName = searchParams?.hostel as GuestHouse;
  
  const { roomCharges } = await api.room.getAllRooms.mutate();

  if (hostelName && roomCharges) {
    let { bookings } = await api.booking.getAllBookings.query({ hostelName });
    bookings = bookings.map((b) => {
      return { ...b, hostelName: removeUnderscore(b.hostelName as GuestHouse) };
    });
    return (
      <AdminDashboardV2
        hostelName={hostelName}
        roomCharges={roomCharges}
        key={Math.random()}
        bookings={bookings}
      ></AdminDashboardV2>
    );
  } else {
    const { bookings } = await api.booking.getAllBookings.query({});
    return (
      <AdminDashboardV2
        roomCharges={roomCharges}
        hostelName={hostelName}
        key={Math.random()}
        bookings={bookings}
      ></AdminDashboardV2>
    );
  }
}
