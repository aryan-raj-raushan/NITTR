import { api } from "~/trpc/server";
import MyBookings from "../_components/Booking/myBookings";
import NoBookingsCard from "../_components/Booking/noBookingsCard";

export default async function Page() {
  const { bookings } = await api.booking.getAllBookings.query({})
  if (!!bookings.length) {
    return <MyBookings bookings={bookings}></MyBookings>
  }
  return <NoBookingsCard></NoBookingsCard>
}
export const dynamic = "force-dynamic"
