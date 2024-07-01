"use client";
import { UserIcon } from "lucide-react";
import { GuestProfile } from "@prisma/client";
import { Checkbox } from "~/components/ui/checkbox";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import { api } from "~/trpc/react";
import { useEffect, useState } from "react";
import AdminGuestForm from "~/app/_components/guests/guestFormAdmin";
import { useAppSelector } from "~/store";
import SearchForm from "~/app/_components/SearchForm";

export default function Page() {
  const [guests, setGuests] = useState<GuestProfile[]>([]);
  const [selectedGuests, setSelectedGuests] = useState<GuestProfile[]>([]);
  const { id } = useAppSelector((store: any) => store.auth);
  const userId = id;

  const getGuestsMutation = api.guests.getGuestsByUserId.useMutation({
    onSuccess: async ({ guests }) => {
      setGuests(guests);
    },
  });

  const removeGuestMutation = api.guests.removeGuest.useMutation({
    onSuccess: async () => {
      if (userId) {
        getGuestsMutation.mutate({ userId });
      }
    },
  });

  const removeGuest = (guestId: string) => {
    removeGuestMutation.mutate(guestId, {
      onSuccess: () => {
        setGuests((prevGuests) =>
          prevGuests.filter((guest) => guest.id !== guestId),
        );
        setSelectedGuests((prevSelectedGuests) =>
          prevSelectedGuests.filter((guest) => guest.id !== guestId),
        );
      },
    });
  };

  useEffect(() => {
    getGuestsMutation.mutate({ userId: id ?? "" });
  }, [id]);
  return (
    <>
      <main className="items-center justify-center lg:flex lg:min-h-[60vh] lg:overflow-hidden">
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
          <div className="flex flex-col items-center justify-center gap-8">
            <div className="pt-10 ">
              <SearchForm
                aboveClass="justify-center"
                belowClass="w-fit"
                guests={selectedGuests.length}
              />
            </div>
            <div className="flex min-w-[40rem] flex-col items-center justify-center ">
              <div>
                {!!guests.length && (
                  <DialogTrigger className="mt-6 w-full text-center text-sm font-bold">
                    + Add New Guest
                  </DialogTrigger>
                )}
              </div>

              {!!!guests.length && (
                <div className="mx-auto flex w-full items-center justify-center border py-5">
                  <AdminGuestForm></AdminGuestForm>
                </div>
              )}

              <div className="w-full border mt-4">
                {guests.map((g, index) => {
                  return (
                    <li key={g.id + index} className="flex py-4 sm:py-4 px-4">
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
                      <div
                        className="border border-red-400 p-1 text-xs font-bold text-red-400 hover:cursor-pointer hover:bg-red-400 hover:text-white"
                        onClick={() => removeGuest(g.id)}
                      >
                        x
                      </div>
                    </li>
                  );
                })}
              </div>
            </div>
          </div>
        </Dialog>
        {/* Checkout form */}
      </main>
    </>
  );
}
