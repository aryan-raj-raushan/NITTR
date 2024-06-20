import { api } from "~/trpc/server";
export const dynamic = "force-dynamic";
import OccupancyReport from "~/app/_components/admin/analytics/Occupany";

export default async function Page({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  let month = searchParams?.month
    ? +searchParams?.month
    : new Date().getMonth();

  const { bookings } = await api.booking.getAllBookings.query({ month });
  if (bookings) {
    return (
      <OccupancyReport
        month={month}
        key={Math.random()}
        bookings={bookings}
      ></OccupancyReport>
    );
  } else {
    return <div>No Bookings Available</div>;
  }
}
