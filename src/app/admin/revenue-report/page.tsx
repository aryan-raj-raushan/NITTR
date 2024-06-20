import RevenueReport from "~/app/_components/admin/analytics/RevenueReport";
export const dynamic = "force-dynamic";
import { api } from "~/trpc/server";

export default async function Page({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const { bookings } = await api.booking.getAllBookings.query({});
  if (bookings) {
    return <RevenueReport bookings={bookings}></RevenueReport>;
  } else {
    return <div>No Bookings Available</div>;
  }
}
