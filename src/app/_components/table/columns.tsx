"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react";
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
      accessorKey: "hostelName",
      header: "Hostel Name",
    },
    {
      accessorKey: "bookingDate",
      header: "Booking Date",
    },
    {
      accessorKey: "userEmail",
      header: "User Email",
    },
    {
      accessorKey: "userName",
      header: "Name",
    },
    {
      accessorKey: "bookedFromDt",
      header: "Check-in Date",
    },
    {
      accessorKey: "bookingStatus",
      header: "Status",
    },

    {
      id: "actions",
      cell: ({ row }) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
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
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
} 
