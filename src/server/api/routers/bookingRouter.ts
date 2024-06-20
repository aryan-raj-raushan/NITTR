import { BookingStatus, GuestHouse } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import nodemailer from "nodemailer";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { CreateBookingValidator } from "~/utils/validators/bookingValidators";

function getRoomCapacity(roomType: string): number {
  switch (roomType) {
    case "SINGLE_BED":
      return 1;
    case "DOUBLE_BED":
      return 2;
    case "TRIPLE_BED":
      return 3;
    case "FOUR_BED":
      return 4;
    default:
      throw new Error("Invalid room type");
  }
}

const transporter: any = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const bookingRouter = createTRPCRouter({
  createBooking: protectedProcedure
    .input(CreateBookingValidator)
    .mutation(async ({ ctx, input }) => {
      const {
        hostelName,
        nosRooms,
        bookingType,
        roomId,
        guestIds,
        remark,
        bookedToDt,
        bookingDate,
        bookedFromDt,
        amount,
        paymentStatus,
        subtotal,
        roomType,
      } = input;
      const userEmail = ctx.session.user.email;
      const userName = ctx.session.user.name;
      const rooms = await ctx.db.roomDetails.findMany({
        where: { hostelName },
        take: nosRooms,
      });

      let totalRoom = 0;
      const totalGuests = guestIds.length;

      if (roomType === "SINGLE_BED") {
        totalRoom = totalGuests;
      } else if (roomType === "DOUBLE_BED") {
        totalRoom = Math.ceil(totalGuests / 2);
      } else if (roomType === "TRIPLE_BED") {
        totalRoom = Math.ceil(totalGuests / 3);
      } else if (roomType === "FOUR_BED") {
        totalRoom = Math.ceil(totalGuests / 4);
      }

      // Handle leftover guests scenario
      if (totalGuests % getRoomCapacity(roomType) !== 0) {
        totalRoom += 1;
      }

      const bookingDetails = await ctx.db.bookingDetails.create({
        data: {
          hostelName,
          remark,
          bookedToDt,
          bookingDate,
          bookedFromDt,
          bookingStatus: BookingStatus.UNCONFIRMED,
          bookedRoom: roomId,
          bookedBed: guestIds?.length,
          bookPaymentId: "",
          guestsList: guestIds.map((g) => g),
          userId: ctx.session.user.id,
          amount,
          roomType: roomType,
          totalRoom: totalRoom,
          paymentStatus,
          subtotal,
        },
      });

      if (rooms.length === nosRooms) {
        await ctx.db.roomDetails.updateMany({
          where: {
            id: { in: rooms.map((r) => r.id) },
          },
          data: {
            bookingDetailsId: bookingDetails.id,
          },
        });
      } else {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }

      await ctx.db.guestProfile.updateMany({
        where: {
          id: { in: guestIds },
        },
        data: {
          bookingDetailsId: bookingDetails.id,
        },
      });
      if (bookingType == "BEDS") {
        await ctx.db.roomDetails.update({
          where: {
            id: roomId,
          },
          data: {
            guests: {
              set: guestIds.map((id) => ({ id })),
            },
          },
        });
      }
      return { bookingDetails: { ...bookingDetails, userEmail, userName } };
    }),

  getAllBookings: protectedProcedure
    .input(
      z.object({
        hostelName: z.custom<GuestHouse>().optional(),
        month: z.number().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      let bookings;
      if (ctx.session.user.role !== "ADMIN") {
        bookings = await ctx.db.bookingDetails.findMany({
          where: { userId: ctx.session.user.id },
          include: {
            guests: true,
            rooms: true,
            user: true,
          },
        });
      } else {
        bookings = await ctx.db.bookingDetails.findMany({
          where: input.hostelName
            ? { hostelName: input.hostelName }
            : undefined,
          include: {
            guests: true,
            rooms: true,
            user: true,
          },
        });
      }
      if (input.month) {
        bookings = bookings.filter(
          (b) => b.bookingDate.getMonth() === input.month,
        );
      }
      return {
        bookings: bookings.map((booking) => ({
          ...booking,
          userEmail: booking.user.email, 
          userName: booking.user.name,
        })),
      };
    }),

  getBookingByID: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const { id } = input;
      const booking = await ctx.db.bookingDetails.findUnique({
        where: {
          id,
        },
        include: {
          guests: true,
          rooms: true,
          user: true,
        },
      });

      if (!booking) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Booking not found",
        });
      }

      return {
        booking: {
          ...booking,
          userEmail: booking.user.email,
          userName: booking.user.name,
        },
      };
    }),

  updateBookingById: protectedProcedure
    .input(
      z.object({ id: z.string(), bookingStatus: z.custom<BookingStatus>() }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, bookingStatus } = input;

      // Update booking status
      const booking = await ctx.db.bookingDetails.update({
        where: {
          id,
        },
        data: {
          bookingStatus,
        },
        include: {
          user: true,
          guests: true,
        },
      });

      if (bookingStatus === BookingStatus.CONFIRMED) {
        console.log("email sent");
        const userEmail = process.env.EMAIL_USER;
        const recipientEmail = booking.user.email;
        const roomId = booking?.bookedRoom;
     
        const updatedRoom = await ctx.db.roomDetails.update({
          where: { id: roomId! },
          data: {
            totalBed: {
              decrement: booking?.bookedBed!,
            },
            totalRoom: {
              decrement: booking?.totalRoom!,
            },
          },
        });
        try {
          await transporter.sendMail({
            from: userEmail,
            to: recipientEmail,
            subject: "Booking Confirmation",
            text: `Your booking with ID ${booking.id} has been confirmed.`,
          });
          console.log(`Email sent to ${recipientEmail}`);
        } catch (error) {
          console.error(`Failed to send email to ${recipientEmail}:`, error);
        }
      }

      return { booking };
    }),
});
