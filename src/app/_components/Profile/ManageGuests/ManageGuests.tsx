"use client"
import { Button } from "~/components/ui/button";
import { UserIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Card } from "~/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import GuestForm from "../../guests/guestForm";
import { Checkbox } from "~/components/ui/checkbox";
import { api } from "~/trpc/react";
import { GuestProfile } from "@prisma/client";
import { useAppSelector } from "~/store";

const ManageGuests = ({ roomCharges }: any) => {
  const { id } = useAppSelector((store: any) => store.auth);
  const userId = id;
  const [guests, setGuests] = useState<GuestProfile[]>([]);
  const [selectedGuests, setSelectedGuests] = useState<GuestProfile[]>([]);
  const [isAddingGuest, setIsAddingGuest] = useState(false);

  const getGuestsMutation = api.guests.getGuestsByUserId.useMutation({
    onSuccess: async ({ guests }) => {
      setGuests(guests);
    },
  });

  useEffect(() => {
    getGuestsMutation.mutate({ userId: id ?? "" });
  }, [id]);

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
          prevGuests.filter((guest) => guest.id !== guestId)
        );
        setSelectedGuests((prevSelectedGuests: any[]) =>
          prevSelectedGuests.filter((guest: { id: string }) => guest.id !== guestId)
        );
      },
    });
  };

  const categoryConst: any = {
    GOVERNMENT_OF_INDIA_OFFICIAL: "Government of India Official",
    STATE_GOVERNMENT_OFFICIAL: "State Government Official",
    CENTRAL_AUTONOMOUS_ORGANISATION_OFFICIAL:
      "Central Autonomous Organisation Official",
    CHAIRMAN_AND_MEMBER_OF_BOARD_OF_GOVERNORS:
      "Chairman and Member of Board of Governors",
    NITTTR_STAFFS_AND_EX_STAFFS: "NITTTR Staffs and Ex-Staffs",
    PARTICIPANT_OF_SHORT_COURSE: "Participant of Short Course",
    INDUCTION_PROGRAM_PARTICIPANTS: "Induction Program Participants",
    MEETING_AND_CONFERENCE_UNDER_WORLD_BANK_AIDED_PROJECT:
      "Meeting and Conference under World Bank Aided Project",
    CONSULTANCY_PROGRAM: "Consultancy Program",
    TEACHERS_OF_ENGINEERING_COLLEGES: "Teachers of Engineering Colleges",
    INTERNATIONAL_PARTICIPANTS: "International Participants",
    OTHER: "Other",
  };

  const typeBody = (category: any) => categoryConst[category?.typeOrg];

  const handleAddGuest = () => {
    setIsAddingGuest(true);
  };

  return (
    <div>
      <h1 className="text-center text-[2rem] font-bold">Manage your guests</h1>
      <div>
        {guests.length < 1 && (
          <div className=" mt-2 flex w-full items-center justify-center rounded-xl border p-4">
            {guests.length === 0 && <GuestForm roomCharges={roomCharges} />}
          </div>
        )}

        {guests.length > 0 && (
          <Card className="mt-5 flex flex-col justify-center gap-5 p-2 shadow-2xl sm:px-8 sm:py-4">
            <div className="w-full">
              {guests.map((g, index) => (
                <li key={g.id + index} className="flex flex-col lg:flex-col justify-between items-start gap-4 w-full p-4 border-b border-gray-200">

                  <div className="flex flex-1 flex-col lg:flex-row justify-between w-full items-start">
                    <div className="flex-shrink-0 sm:flex hidden items-center mb-4 lg:mb-0 lg:mr-4">
                      <UserIcon />
                    </div>
                    <div className="flex flex-col lg:flex-row w-full">
                      <p className="w-full lg:w-auto text-gray-500 lg:mr-4">{g.name}</p>
                      <p className="w-full lg:w-auto text-gray-500 lg:mr-4 lg:border-l lg:border-gray-200 lg:pl-4">
                        {g.gender}
                      </p>
                      <p className="w-full lg:w-auto text-gray-500 lg:border-l lg:border-gray-200 lg:pl-4">
                        {typeBody(g)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 mt-2">
                      <Checkbox
                        id={`terms-${g.id}`}
                        onCheckedChange={(checked: boolean) => {
                          setSelectedGuests((f: any[]) => {
                            if (checked) {
                              const updatedGuestList = [...f, g];
                              return updatedGuestList;
                            } else {
                              const updatedGuestList = f.filter(
                                (item: { id: string }) => item.id !== g.id
                              );
                              return updatedGuestList;
                            }
                          });
                        }}
                      />
                      <label
                        htmlFor={`terms-${g.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Add
                      </label>
                    </div>
                  <Button onClick={() => removeGuest(g.id)} className="">Remove</Button>
                </li>
              ))}
            </div>


            {!!guests.length && (
              <>
                <Dialog>
                  <DialogContent
                    className="no-scrollbar  flex flex-wrap items-center justify-center p-10 text-gray-600 "
                    style={{ width: "50%", height: "90%" }}
                  >
                    <GuestForm roomCharges={roomCharges}></GuestForm>
                  </DialogContent>
                  <DialogTrigger
                    className="w-full text-center text-sm font-bold hover:underline"
                    onClick={handleAddGuest}
                  >
                    + Add New Guest
                  </DialogTrigger>
                </Dialog>

              </>
            )}
          </Card>
        )}
      </div>
    </div>
  );
};

export default ManageGuests;
