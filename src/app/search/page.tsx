import { Suspense } from "react";
import SearchPage from "../_components/search/searchPage";
import { api } from "~/trpc/server";
import { GuestHouse } from "@prisma/client";

export default async function Page({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const hostelName = searchParams?.location as GuestHouse;

  const { bookings } = await api.booking.getAllBookings.query({ hostelName });

  return (
    <Suspense>
      <SearchPage key={hostelName} bookings={bookings}></SearchPage>
    </Suspense>
  );
}
