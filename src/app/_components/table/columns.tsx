"use client";
import { ColumnDef } from "@tanstack/react-table";
import { FaChevronDown } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BookingStatus } from "@prisma/client";
import { TbookingsValidator } from "~/utils/validators/bookingValidators";
import { api } from "~/trpc/react";
import { useState } from "react";

const formatDate = (dateString: Date) => {
  const options: any = { day: "numeric", month: "long", year: "numeric" };
  return new Date(dateString).toLocaleDateString("en-GB", options);
};

export function columns(): ColumnDef<TbookingsValidator>[] {
  const utils = api.useUtils();
  const updateBookingStatusMutation = api.booking.updateBookingById.useMutation(
    {
      onSuccess: async ({ booking }) => {
        utils.booking.getAllBookings.invalidate();
        window.location.reload();
      },
    },
  );
  return [
    {
      accessorKey: "id",
      header: "Booking Id",
    },
    {
      accessorKey: "userName",
      header: "Name",
    },
    {
      accessorKey: "userEmail",
      header: "User Email",
    },
    {
      accessorKey: "hostelName",
      header: "Hostel Name",
      cell: ({ getValue }: any) => getValue().replace(/_/g, " "),
    },
    {
      accessorKey: "bookingDate",
      header: "Booking Date",
      cell: ({ getValue }: any) => formatDate(getValue()),
    },
    {
      accessorKey: "bookedFromDt",
      header: "Check-in Date",
      cell: ({ getValue }: any) => formatDate(getValue()),
    },
    {
      accessorKey: "bookingStatus",
      header: "Status",
      cell: ({ row }) => {
        const [isOpen, setIsOpen] = useState(false);
        const bookingStatus:any = row.getValue("bookingStatus") === "UNCONFIRMED" ? "PENDING" : row.getValue("bookingStatus");
        return (
          <DropdownMenu onOpenChange={(open) => setIsOpen(open)}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full text-left">
                {bookingStatus}
                <FaChevronDown
                  className={`text-gray-500 ml-2 inline-block h-4 w-4 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => {
                  updateBookingStatusMutation.mutate({
                    id: row.getValue("id"),
                    bookingStatus: BookingStatus.CONFIRMED,
                  });
                }}
              >
                Confirm
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  updateBookingStatusMutation.mutate({
                    id: row.getValue("id"),
                    bookingStatus: BookingStatus.CANCELED,
                  });
                }}
              >
                Cancel
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  updateBookingStatusMutation.mutate({
                    id: row.getValue("id"),
                    bookingStatus: BookingStatus.CHECKOUT,
                  });
                }}
              >
                Checkout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}
