import cron from "node-cron";
import { BookingStatus } from "@prisma/client";
import { startOfDay, isBefore } from "date-fns";

export async function updateExpiredBookings(ctx: any) {
  const today = startOfDay(new Date());

  const bookingsToExpire = await ctx.db.bookingDetails.findMany({
    where: {
      bookingStatus: {
        in: [BookingStatus.CONFIRMED, BookingStatus.UNCONFIRMED],
      },
      OR: [{ bookedFromDt: { lt: today } }, { bookedToDt: { lt: today } }],
    },
  });

  const unconfirmedBookings = bookingsToExpire.filter(
    (booking: any) =>
      booking.bookingStatus === BookingStatus.UNCONFIRMED &&
      isBefore(new Date(booking.bookedFromDt), today),
  );

  const confirmedBookings = bookingsToExpire.filter(
    (booking: any) =>
      booking.bookingStatus === BookingStatus.CONFIRMED &&
      isBefore(new Date(booking.bookedToDt), today),
  );

  if (unconfirmedBookings.length > 0) {
    await ctx.db.bookingDetails.updateMany({
      where: {
        id: {
          in: unconfirmedBookings.map((booking: any) => booking.id),
        },
      },
      data: {
        bookingStatus: BookingStatus.CANCELED,
      },
    });
    console.log(
      `Expired ${unconfirmedBookings.length} unconfirmed bookings due to missed check-in dates.`,
    );
  }

  if (confirmedBookings.length > 0) {
    await ctx.db.bookingDetails.updateMany({
      where: {
        id: {
          in: confirmedBookings.map((booking: any) => booking.id),
        },
      },
      data: {
        bookingStatus: BookingStatus.CHECKOUT,
      },
    });
    console.log(
      `Checked out ${confirmedBookings.length} confirmed bookings due to passed checkout dates.`,
    );
  }
}

export function scheduleBookingExpirationJob(ctx: any) {
  cron.schedule("0 0 * * *", async () => {
    try {
      console.log("Running expiration and checkout status check at 12:00 AM");
      await updateExpiredBookings(ctx);
    } catch (error) {
      console.error("Error updating expired/checkout bookings:", error);
    }
  });
}
