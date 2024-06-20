import BookingConfirmed from "~/app/_components/Booking/BookingConfirmed"
import { api } from "~/trpc/server"

export default async function Page(
  { params }: { params: { id: string } }
) {
  const { booking } = await api.booking.getBookingByID.query({ id: params.id })
  if (booking) {
    return <BookingConfirmed booking={booking}></BookingConfirmed>
  }
  else {
    return <div>INVALID BOOKING ID</div>
  }
}
