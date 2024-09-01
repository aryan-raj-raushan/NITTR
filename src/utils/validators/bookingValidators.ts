import { GuestHouse, Prisma } from "@prisma/client";
import { z } from "zod";
import { CreateGuestValidator } from "./guestValidators";

export const CreateBookingValidator = z.object({
  hostelName: z.custom<GuestHouse>(),
  bookingDate: z.string(),
  bookedFromDt: z.date(),
  bookedToDt: z.date(),
  userId: z.string(),
  userName: z.string(),
  userEmail: z.string(),
  remark: z.string(),
  bookPaymentId: z.string().optional(),
  guestIds: z.array(z.string()).min(1),
  nosRooms: z.number().min(1).optional(),
  nosBeds: z.number().min(1).optional(),
  bookingType: z.enum(["ROOM", "BEDS"]),
  roomId: z.string(),
  amount: z.number(),
  roomType: z.string(),
  totalRoom: z.number().optional(),
  paymentStatus: z.string().optional(),
  paymentMode: z.string().optional(),
  subtotal: z.number(),
});
export type TCreateBookingValidator = z.infer<typeof CreateGuestValidator>;

export const bookingsValidator =
  Prisma.validator<Prisma.BookingDetailsFindManyArgs>()({
    include: {
      guests: true,
      rooms: true,
    },
  });
export type TbookingsValidator = Prisma.BookingDetailsGetPayload<
  typeof bookingsValidator
>;

export const emptyBooking: any = {
  id: "",
  bookingStatus: "UNCONFIRMED",
  hostelName: "SARAN_GUEST_HOUSE",
  updateBy: "",
  createdAt: new Date(),
  updatedAt: new Date(),
  bookingDate: new Date(),
  bookedFromDt: new Date(),
  bookedToDt: new Date(),
  remark: "",
  bookPaymentId: "",
  userId: "",
  guests: [],
  rooms: [],
  amount: 0,
  subtotal: 0,
  bookedBed: 0,
  bookedRoom: "",
  guestsList: [],
  paymentStatus: "",
  paymentMode: "",
};
