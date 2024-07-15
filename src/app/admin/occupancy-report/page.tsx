import { api } from "~/trpc/server";
export const dynamic = "force-dynamic";
import OccupancyReport from "~/app/_components/admin/analytics/Occupany";

export default async function Page() {
  const { bookings } = await api.booking.getAllBookings.query({});
  const { roomDetails } = await api.room.getAllRooms.mutate();
  if (bookings) {
    return (
      <OccupancyReport
        key={Math.random()}
        bookings={bookings}
        roomDetails={roomDetails}
      ></OccupancyReport>
    );
  } else {
    return <div>No Bookings Available</div>;
  }
}
