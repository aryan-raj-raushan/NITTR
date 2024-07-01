import { api } from "~/trpc/server";
export const dynamic = "force-dynamic";
import OccupancyReport from "~/app/_components/admin/analytics/Occupany";

export default async function Page() {
  const { bookings } = await api.booking.getAllBookings.query({});
  if (bookings) {
    return (
      <OccupancyReport
        // month={month}
        key={Math.random()}
        bookings={bookings}
      ></OccupancyReport>
    );
  } else {
    return <div>No Bookings Available</div>;
  }
}
