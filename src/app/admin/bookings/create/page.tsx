"use client";
import { Disclosure } from "@headlessui/react";
import { UserIcon } from "lucide-react";
import {
  BookingStatus,
  GuestHouse,
  GuestProfile,
  RoomDetails,
  RoomTariff,
} from "@prisma/client";
import { TypeOrg } from "@prisma/client";
import { useSession } from "next-auth/react";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import { useToast } from "~/components/ui/use-toast";
import { api } from "~/trpc/react";
// import {
//   CreateGuestValidator,
//   TCreateGuestValidator,
// } from "~/utils/validators/guestValidators";
import { useEffect, useState } from "react";
// import { useRouter } from "next/router";
import AdminGuestForm from "~/app/_components/guests/guestFormAdmin";
import { Input } from "~/components/ui/input";

export default function Page() {
  const [guests, setGuests] = useState<GuestProfile[]>([]);
  const [selectedGuests, setSelectedGuests] = useState<GuestProfile[]>([]);
  const [selectedNumberOfRooms, setSelectedNumberOfRooms] = useState(1);
  const { toast } = useToast();
  const { data: session } = useSession();

  // const createBookingMutation = api.booking.createBooking.useMutation({
  //   onSuccess: async ({ bookingDetails }) => {
  //     toast({
  //       title: "Booking Successful",
      
  //     });

  //     setTimeout(() => {
  //       window.location.href = "/admin/bookings";
  //     });
  //   },
  // });

  const getGuestsMutation = api.guests.getGuestsByUserId.useMutation({
    onSuccess: async ({ guests }) => {
      setGuests(guests);
    },
  });

  useEffect(() => {
    getGuestsMutation.mutate({ userId: session?.user.id ?? "" });
  }, []);
  return (
    <>
      <main className="items-center justify-center lg:flex lg:min-h-full   lg:overflow-hidden">
        <div className="px-4 py-6 sm:px-6 lg:hidden">
          <div className="mx-auto flex max-w-lg">
            <a href="#">
              <span className="sr-only">Your Company</span>
            </a>
          </div>
        </div>
        <Dialog>
          <DialogContent
            className="no-scrollbar flex flex-wrap items-center justify-center p-10 text-gray-600 "
            style={{ width: "50%", height: "90%", overflow: "auto" }}
          >
            <AdminGuestForm></AdminGuestForm>
          </DialogContent>
          <div className="min-w-[40rem] flex-col p-4">
            <div className="mt-2 flex items-center justify-center gap-10">
              <Button
                onClick={() => {
                  if (!selectedGuests.length) {
                    return alert("Please Select atleast 1 Guest");
                  }
                  //createBookingMutation.mutate({
                  //  hostelName: GuestHouse.SARAN_GUEST_HOUSE,
                  //  guestIds: selectedGuests.map(g => g.id),
                  //  bookingDate: new Date().toISOString(),
                  //  bookedFromDt: new Date(),
                  //  bookedToDt: new Date(),
                  //  nosRooms: selectedNumberOfRooms,
                  //  remark: "",
                  //})
                }}
              >
                Confirm Booking
              </Button>

              <Input
                onChange={(e) => {
                  setSelectedNumberOfRooms(Number(e.target.value));
                }}
                type="number"
                placeholder="rooms"
                className="w-24"
              />
            </div>
            <div>
              {!!guests.length && (
                <DialogTrigger className="mt-6 w-full text-center text-sm font-bold">
                  + Add New Guest
                </DialogTrigger>
              )}
            </div>
            <div className="w-full">
              {!!!guests.length && <AdminGuestForm></AdminGuestForm>}
            </div>

            <div className="w-full">
              {guests.map((g, index) => {
                return (
                  <li key={g.id + index} className="flex py-6 sm:py-10">
                    <div className="flex-shrink-0">
                      <UserIcon></UserIcon>
                    </div>
                    <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                      <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                        <div>
                          <div className="flex justify-between">
                            <h3 className="text-sm"></h3>
                          </div>
                          <div className="mt-1 flex text-sm">
                            <p className="text-gray-500">{g.name}</p>
                            <p className="ml-4 border-l border-gray-200 pl-4 text-gray-500">
                              {g.gender}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="terms"
                            onCheckedChange={(checked: boolean) => {
                              setSelectedGuests((f) => {
                                if (checked) {
                                  const updatedGuestList = [...f, g];
                                  return updatedGuestList;
                                } else {
                                  const updatedGuestList = f.filter(
                                    (item) => item.id !== g.id,
                                  );
                                  return updatedGuestList;
                                }
                              });
                            }}
                          />
                          <label
                            htmlFor="terms"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Add
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="border border-red-400 p-1 text-xs font-bold text-red-400 hover:cursor-pointer hover:bg-red-400 hover:text-white">
                      x
                    </div>
                  </li>
                );
              })}
            </div>
          </div>
        </Dialog>
        {/* Checkout form */}
      </main>
    </>
  );
}