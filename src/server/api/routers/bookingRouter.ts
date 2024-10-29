import { BookingStatus, GuestHouse } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import nodemailer from "nodemailer";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { CreateBookingValidator } from "~/utils/validators/bookingValidators";
import { startOfDay } from "date-fns";

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
    .mutation(async ({ ctx, input }: any) => {
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
        userId,
        paymentStatus,
        paymentMode,
        subtotal,
        userName,
        userEmail,
        roomType,
      } = input;

      const rooms = await ctx.db.roomDetails.findMany({
        where: { hostelName },
        take: nosRooms,
      });

      let totalBeds = 0;
      if (roomType === "SINGLE_BED") {
        totalBeds = nosRooms;
      } else if (roomType === "DOUBLE_BED") {
        totalBeds = Math.ceil(nosRooms * 2);
      } else if (roomType === "TRIPLE_BED") {
        totalBeds = Math.ceil(nosRooms * 3);
      } else if (roomType === "FOUR_BED") {
        totalBeds = Math.ceil(nosRooms * 4);
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
          bookedBed: totalBeds,
          bookPaymentId: "",
          guestsList: guestIds.map((g: any) => g),
          userId: userId!,
          userName,
          userEmail,
          amount,
          roomType: roomType,
          totalRoom: nosRooms,
          paymentStatus,
          subtotal,
          paymentMode: paymentMode,
          roomOccupied: [],
        },
      });

      if (rooms[0]?.totalRoom >= nosRooms) {
        await ctx.db.roomDetails.updateMany({
          where: {
            id: { in: rooms.map((r: any) => r.id) },
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
      if (bookingType == "ROOM") {
        await ctx.db.roomDetails.update({
          where: {
            id: roomId,
          },
          data: {
            guests: {
              set: guestIds.map((id: any) => ({ id })),
            },
          },
        });
      }
      return { bookingDetails: { ...bookingDetails } };
    }),

  getAllBookings: protectedProcedure
    .input(
      z.object({
        hostelName: z.custom<GuestHouse>().optional(),
        month: z.number().optional(),
      }),
    )
    .query(async ({ ctx, input }: any) => {
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

      return {
        bookings: bookings.map((booking: any) => ({
          ...booking,
        })),
      };
    }),

  getUserBookings: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
      }),
    )
    .query(async ({ ctx, input }: any) => {
      const { userId } = input;

      let bookings = await ctx.db.bookingDetails.findMany({
        where: {
          userId: userId,
        },
        include: {
          guests: true,
          rooms: true,
        },
      });

      return {
        bookings: bookings.map((booking: any) => ({
          ...booking,
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
          userEmail: booking?.userEmail ?? "N/A",
          userName: booking?.userName ?? "N/A",
        },
      };
    }),

  updateBookingById: protectedProcedure
    .input(
      z.object({ id: z.string(), bookingStatus: z.custom<BookingStatus>() }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, bookingStatus } = input;

      // Fetch the booking details
      const booking = await ctx.db.bookingDetails.findUnique({
        where: { id },
        include: {
          user: true,
          guests: true,
        },
      });

      if (!booking) {
        throw new Error("Booking not found");
      }

      const roomDetails = await ctx.db.roomDetails.findMany({
        where: { hostelName: booking.hostelName },
      });

      const confirmedBookings = await ctx.db.bookingDetails.findMany({
        where: {
          hostelName: booking.hostelName,
          bookingStatus: BookingStatus.CONFIRMED,
          id: { not: booking.id },
        },
      });

      const calculateAvailability = (
        roomDetails: any[],
        confirmedBookings: any[],
        checkInDate: Date,
        checkOutDate: Date,
      ) => {
        return roomDetails.map((roomDetail) => {
          let availableRooms = roomDetail.totalRoom;
          let availableBeds = roomDetail.totalBed;

          confirmedBookings.forEach((confirmedBooking) => {
            const bookedFrom = startOfDay(
              new Date(confirmedBooking.bookedFromDt),
            );
            const bookedTo = startOfDay(new Date(confirmedBooking.bookedToDt));
            const desiredFrom = startOfDay(new Date(checkInDate));
            const desiredTo = startOfDay(new Date(checkOutDate));

            if (desiredFrom < bookedTo && desiredTo > bookedFrom) {
              if (confirmedBooking.roomType === roomDetail.roomType) {
                availableRooms -= confirmedBooking.totalRoom;
                availableBeds -= confirmedBooking.bookedBed;
              }
            }
          });

          return {
            roomType: roomDetail.roomType,
            availableRooms: availableRooms,
            availableBeds: availableBeds,
          };
        });
      };

      const availability = calculateAvailability(
        roomDetails,
        confirmedBookings,
        new Date(booking.bookedFromDt),
        new Date(booking.bookedToDt),
      );

      const requestedRoomType = roomDetails.find(
        (roomDetail) => roomDetail.roomType === booking.roomType,
      );

      if (!requestedRoomType) {
        throw new Error("Room type not found");
      }

      const availableRoomsForRequestedType = availability.find(
        (room) => room.roomType === requestedRoomType.roomType,
      )?.availableRooms;

      if (
        availableRoomsForRequestedType === undefined ||
        (booking.bookedBed !== null &&
          availableRoomsForRequestedType < booking.bookedBed)
      ) {
        throw new Error("Not enough available rooms for the requested booking");
      }

      const roomAllotment = async (booking: any, roomType: any) => {
        let startRoom = 0;
      
        // Determine the starting room number based on room type
        if (roomType === "SINGLE_BED") {
          startRoom = 101;
        } else if (roomType === "DOUBLE_BED") {
          startRoom = 201;
        } else if (roomType === "TRIPLE_BED") {
          startRoom = 301;
        } else {
          throw new Error("Invalid room type");
        }
      
        // Get all confirmed bookings for the same room type and hostel
        const confirmedBookings = await ctx.db.bookingDetails.findMany({
          where: {
            hostelName: booking.hostelName,
            bookingStatus: BookingStatus.CONFIRMED,
            roomType: roomType,
          },
        });
      
        const checkInDate = new Date(booking.bookedFromDt);
        const checkOutDate = new Date(booking.bookedToDt);
      
        const occupiedRooms = new Set();
      
        // Identify rooms that are already occupied during the requested date range
        confirmedBookings.forEach((confirmedBooking) => {
          const bookedFrom = new Date(confirmedBooking.bookedFromDt);
          const bookedTo = new Date(confirmedBooking.bookedToDt);
      
          // Check if the requested dates overlap with existing bookings
          if (
            (checkInDate < bookedTo && checkOutDate > bookedFrom) &&
            confirmedBooking.roomOccupied
          ) {
            confirmedBooking.roomOccupied.forEach((room: string) => {
              occupiedRooms.add(room); // Track occupied rooms
            });
          }
        });
      
        const allottedRooms: string[] = [];
      
        // Loop to allot the requested number of rooms
        for (let roomNo = startRoom; roomNo < startRoom + 100 && allottedRooms.length < booking.totalRoom; roomNo++) {
          if (!occupiedRooms.has(roomNo.toString())) {
            allottedRooms.push(roomNo.toString()); // Add the available room
          }
        }
      
        if (allottedRooms.length < booking.totalRoom) {
          throw new Error(`Not enough available rooms for the requested booking. Needed: ${booking.totalRoom}, Available: ${allottedRooms.length}`);
        }
      
        await ctx.db.bookingDetails.update({
          where: { id: booking.id },
          data: {
            roomOccupied: { push: allottedRooms }, 
          },
        });
      
        return allottedRooms;
      };
      
      

        await ctx.db.bookingDetails.update({
        where: { id },
        data: { bookingStatus },
        include: { user: true, guests: true },
      });


      const sendEmail = async (subject: string, text: string) => {
        const userEmail = process.env.EMAIL_USER;
        const recipientEmail = booking.userEmail ?? "no-reply@example.com";

        try {
          await transporter.sendMail({
            from: userEmail,
            to: recipientEmail,
            subject,
            text,
          });
          console.log(`Email sent to ${recipientEmail}`);
        } catch (error) {
          console.error(`Failed to send email to ${recipientEmail}:`, error);
        }
      };

      switch (bookingStatus) {
        case BookingStatus.CHECKOUT:
          await ctx.db.bookingDetails.update({
            where: { id },
            data: {
              roomOccupied: []
            },
          });
          await sendEmail(
            "Checkout Confirmation",
            `Your checkout for booking ID ${booking.id} has been confirmed. Thank you for staying with us!`,
          );
          break;

        case BookingStatus.CONFIRMED: {
          if (booking.bookingStatus !== BookingStatus.CONFIRMED) {
            const allottedRoom = await roomAllotment(booking, booking.roomType);
            await sendEmail(
              "Booking Confirmation",
              `Your booking with ID ${booking.id} has been confirmed. Allotted room: ${allottedRoom}.`,
            );
          } else {
            await sendEmail(
              "Booking Confirmation",
              `Your booking with ID ${booking.id} has been confirmed.`,
            );
          }
          break;
        }

        case BookingStatus.CANCELED:
          await ctx.db.bookingDetails.update({
            where: { id },
            data: {
              roomOccupied: [] 
            },
          });
          await sendEmail(
            "Booking Cancellation",
            `Your booking with ID ${booking.id} has been canceled.`,
          );
          break;

        default:
          console.log("Unknown booking status");
      }

      return { booking };
    }),
});
