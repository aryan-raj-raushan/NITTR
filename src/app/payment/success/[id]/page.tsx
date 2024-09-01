import BookingConfirmedPage from "~/app/_components/Booking/BookingConfirmedPage";
import { api } from "~/trpc/server";

export default async function Page({ params }: { params: { id: string } }) {
  const { booking } = await api.booking.getBookingByID.query({ id: params.id });

  if (booking) {
    return <BookingConfirmedPage booking={booking} />;
  } 
  else {
    return <div>INVALID BOOKING ID</div>;
  }
}