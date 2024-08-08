"use client";
import { UserIcon } from "lucide-react";// @ts-ignore
import { GuestProfile, RoomCharges } from "@prisma/client";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import { api } from "~/trpc/react";
import { useEffect, useState } from "react";
import GuestForm from "../guests/guestForm";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useRouter } from "next/navigation";
import { TbookingType } from "~/lib/utils";
import { Card } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { useAppSelector } from "~/store";
import { Bounce, toast } from "react-toastify";
import axios from "axios";
import { CreateOrder } from "~/utils/url/authurl";

function datediff(first: Date, second: Date) {
  //@ts-ignore
  return Math.round((second - first) / (1000 * 60 * 60 * 24));
}

export default function Checkout({
  roomDetails,
  roomCharges,
  checkin,
  checkout,
  bookingType,
}: {
  roomDetails: any;
  roomCharges: RoomCharges;
  checkin: Date;
  checkout: Date;
  bookingType: TbookingType;
}) {
  const [guests, setGuests] = useState<GuestProfile[]>([]);
  const [selectedGuests, setSelectedGuests] = useState<GuestProfile[]>([]);
  const [selectedNumberOfRoomsOrBeds, setSelectedNumberOfRoomsOrBeds] =
    useState(1);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("offline");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { id, name, email } = useAppSelector((store: any) => store.auth);
  const userId = id;
  const userName = name;
  const userEmail = email;
  const [paymentTotal, setPaymentTotal] = useState<any>();

  const createBookingMutation = api.booking.createBooking.useMutation({
    onSuccess: async ({ bookingDetails }: any) => {
      if (selectedPaymentMethod === "offline") {
        toast.success("Booking successful!", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
        setTimeout(() => {
          router.push(`/payment/success/${bookingDetails.id}`);
        }, 3000);
        setLoading(true);
      } else {
        initiateOnlinePayment(paymentTotal);
        setLoading(true);
      }
      setLoading(false);
    },
  });

  const initiateBillDeskPayment = (response:any) => {
    console.log("open form",response);
    if (!response || !response.links) {
        console.error("Invalid response or links not present", response);
        return;
    }
    const redirectLink = response.links.find((link:any) => link.rel === "redirect");
    if (!redirectLink || !redirectLink.parameters) {
        console.error("Redirect link or parameters not found", redirectLink);
        return;
    }
    const form = document.createElement("form");
    form.setAttribute("name", "sdklaunch");
    form.setAttribute("id", "sdklaunch");
    form.setAttribute("action", redirectLink.href);
    form.setAttribute("method", "POST");

    const parameters = {
        'bdorderid': redirectLink.parameters.bdorderid,
        'merchantid': redirectLink.parameters.mercid,
        'rdata': redirectLink.parameters.rdata
    };
    Object.entries(parameters).forEach(([key, value]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = value;
        form.appendChild(input);
    });
    const submitButton = document.createElement("input");
    submitButton.type = "submit";
    submitButton.value = "Complete your Payment";
    form.appendChild(submitButton);
    document.body.appendChild(form);
    form.submit();
};
  function generateOrderId() {
    const prefix = "UAT";
    const timestamp = Date.now().toString(36).slice(-4);
    const randomPart = Math.random().toString(36).substring(2, 10);
    return `${prefix}${timestamp}${randomPart}`;
  }
  const initiateOnlinePayment = async (amount: any) => {
    const bookingId = generateOrderId();
    try {
      const response = await axios.post(CreateOrder, {
        orderid: bookingId,
        amount: "5",
        return_url: `${window.location.origin}/payment`,
        additional_info1: "Info1",
        additional_info2: "Info2",
      });

      initiateBillDeskPayment(response?.data);
    } catch (error) {
      console.error("Error initiating online payment:", error);
      toast.error("Failed to initiate online payment", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    }
  };

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

  const getGuestsMutation = api.guests.getGuestsByUserId.useMutation({
    onSuccess: async ({ guests }) => {
      setGuests(guests);
    },
  });

  useEffect(() => {
    getGuestsMutation.mutate({ userId: id ?? "" });
  }, [id]);

  if (roomDetails) {
    const totalDay = datediff(checkin, checkout);
    const subtotal = selectedGuests.reduce((total, guest) => {
      const charge = roomCharges?.[guest?.typeOrg] ?? 0;
      return total + charge * totalDay;
    }, 0);
    const tax = subtotal * 0.18;
    const total = subtotal + tax;
    const guestLabel = selectedGuests.length === 1 ? "guest" : "guests";

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

    return (
      <>
        {!loading ? (
          <main className="lg:flex lg:min-h-full">
            <div className="px-4 py-6 sm:px-6 lg:hidden">
              <div className="mx-auto flex max-w-lg">
                <a href="#">
                  <span className="sr-only">Your Company</span>
                </a>
              </div>
            </div>

            <h1 className="sr-only">Checkout</h1>
            {/* Order summary */}

            <Dialog>
              <DialogContent
                className="no-scrollbar  flex flex-wrap items-center justify-center p-10 text-gray-600 "
                style={{ width: "50%", height: "90%" }}
              >
                <GuestForm roomCharges={roomCharges}></GuestForm>
              </DialogContent>
              <div className="mx-auto mb-10 flex w-full max-w-[1280px] flex-col justify-center gap-8 px-5 sm:flex-row sm:px-0">
                <section
                  aria-labelledby="payment-heading"
                  className="flex w-full flex-col py-4 sm:w-3/5"
                >
                  {/*JSON.stringify(checkin + ":" + checkout)*/}

                  <Card className="mt-4 flex w-full flex-col justify-center gap-5 p-6">
                    <div className="flex flex-col ">
                      <div>
                        Hostel Name -{" "}
                        <b>{roomDetails?.hostelName?.replace(/_/g, " ")}</b>
                      </div>
                      <div>
                        Room Type - <b>{roomDetails?.value}</b>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex w-full gap-2 text-center">
                        {checkin?.toDateString()}
                        <div className="flex w-full flex-1 items-center justify-center">
                          <Separator></Separator>
                        </div>
                      </div>
                      <div className="flex w-fit min-w-40 items-center justify-center text-center">
                        {" "}
                        {datediff(checkin, checkout)} nights
                      </div>
                      <div className="flex w-full gap-2 text-center">
                        <div className="flex w-full flex-1 items-center justify-center">
                          <Separator></Separator>
                        </div>
                        {checkout?.toDateString()}
                      </div>
                    </div>

                    <div className="no-scrollbar flex flex-col justify-start gap-4  overflow-auto text-sm lg:flex-row lg:justify-center lg:gap-6">
                      <div className="flex min-w-44 flex-col items-center justify-center rounded-xl bg-gradient-to-r from-[#d2d2d2] to-[#b1b1b4] p-3 shadow-xl lg:min-w-fit">
                        <div>User ID</div>
                        <div>
                          <b>{userId}</b>
                        </div>
                      </div>
                      {/* <div className="flex min-w-44 flex-col items-center justify-center rounded-xl bg-gradient-to-r from-[#d2d2d2] to-[#b1b1b4] p-3 shadow-xl lg:min-w-fit">
                        <div>Floor</div>
                        <div>
                          <b>{roomDetails.floor?.replace(/_/g, " ")}</b>
                        </div>
                      </div> */}

                      <div className="flex min-w-44 flex-col items-center justify-center rounded-xl bg-gradient-to-r from-[#d2d2d2] to-[#b1b1b4] p-3  shadow-xl lg:min-w-fit">
                        <div>Bed Type</div>
                        <div>
                          <b>{roomDetails?.roomType?.replace(/_/g, " ")}</b>
                        </div>
                      </div>

                      {/* <div className="flex min-w-44 flex-col items-center justify-center rounded-xl bg-gradient-to-r from-[#d2d2d2] to-[#b1b1b4] p-3  shadow-xl lg:min-w-fit">
                        <div>Available Beds</div>
                        <div>
                          <b>{roomDetails?.totalBed}</b>
                        </div>
                      </div> */}

                      <div className="flex min-w-44 flex-col items-center justify-center rounded-xl bg-gradient-to-r from-[#d2d2d2] to-[#b1b1b4] p-3 shadow-xl lg:min-w-fit">
                        <div>Occupancy</div>
                        <div>
                          <b>{roomDetails.occupancy}</b>
                        </div>
                      </div>
                    </div>
                  </Card>

                  {guests.length < 1 && (
                    <div className="mt-10 flex w-full items-center justify-center rounded-xl border border-gray-300 p-4">
                      {!!!guests.length && (
                        <GuestForm roomCharges={roomCharges}></GuestForm>
                      )}
                    </div>
                  )}

                  {guests.length > 0 && (
                    <Card className="mt-10 flex flex-col justify-center gap-5 p-2 sm:px-8 sm:py-4">
                      <span className="w-fit rounded-sm bg-gray-400 p-2 text-2xl">
                        Guests List
                      </span>
                      <div className="w-full">
                        {guests.map((g, index) => (
                          <li
                            key={g.id + index}
                            className="flex w-full flex-col items-start justify-between gap-4 border-b border-gray-200 p-4 lg:flex-col"
                          >
                            <div className="flex w-full flex-1 flex-col items-start justify-between lg:flex-row">
                              <div className="mb-4 hidden flex-shrink-0 items-center sm:flex lg:mb-0 lg:mr-4">
                                <UserIcon />
                              </div>
                              <div className="flex w-full flex-col lg:flex-row">
                                <p className="w-full text-gray-500 lg:mr-4 lg:w-auto">
                                  {g.name}
                                </p>
                                <p className="w-full text-gray-500 lg:mr-4 lg:w-auto lg:border-l lg:border-gray-200 lg:pl-4">
                                  {g.gender}
                                </p>
                                <p className="w-full text-gray-500 lg:w-auto lg:border-l lg:border-gray-200 lg:pl-4">
                                  {typeBody(g)}
                                </p>
                              </div>

                              <div className="mt-2 hidden items-center space-x-2 lg:flex">
                                <Checkbox
                                  id={`terms-${g.id}`}
                                  onCheckedChange={(checked: boolean) => {
                                    setSelectedGuests((f: any[]) => {
                                      if (checked) {
                                        const updatedGuestList = [...f, g];
                                        return updatedGuestList;
                                      } else {
                                        const updatedGuestList = f.filter(
                                          (item: { id: string }) =>
                                            item.id !== g.id,
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
                            </div>

                            <div className="flex w-full items-center justify-center gap-2 lg:justify-end">
                              <Button
                                type="button"
                                onClick={() => {
                                  setSelectedGuests((f: any[]) => {
                                    const isSelected = f.some(
                                      (item: { id: string }) =>
                                        item.id === g.id,
                                    );
                                    if (isSelected) {
                                      const updatedGuestList = f.filter(
                                        (item: { id: string }) =>
                                          item.id !== g.id,
                                      );
                                      return updatedGuestList;
                                    } else {
                                      const updatedGuestList = [...f, g];
                                      return updatedGuestList;
                                    }
                                  });
                                }}
                                className="rounded-md bg-black px-8 py-2 text-sm font-medium text-white lg:hidden"
                              >
                                {selectedGuests.some(
                                  (item: { id: string }) => item.id === g.id,
                                )
                                  ? "Remove"
                                  : "Add"}
                              </Button>

                              <Button
                                onClick={() => removeGuest(g.id)}
                                className="bg-red-500 py-2 hover:bg-red-800"
                              >
                                <span className="lg:hidden">Delete Guest</span>{" "}
                                <span className="hidden lg:block">Remove</span>
                              </Button>
                            </div>
                          </li>
                        ))}
                      </div>

                      {!!guests.length && (
                        <DialogTrigger className="w-full text-center text-sm font-bold hover:underline">
                          + Add New Guest
                        </DialogTrigger>
                      )}
                    </Card>
                  )}
                </section>

                <section
                  aria-labelledby="summary-heading"
                  className=" flex w-full flex-col sm:w-1/5 "
                >
                  <h2 id="summary-heading" className="sr-only">
                    Order summary
                  </h2>

                  <ul role="list" className="h-fit w-full ">
                    {[roomDetails].map((room, index) => (
                      <li key={room.id + index} className="flex space-x-2 py-6">
                        <img
                          src={roomDetails.roomImg[0]}
                          alt={
                            "https://plus.unsplash.com/premium_photo-1663126298656-33616be83c32?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                          }
                          className="h-24 w-24 flex-none rounded-md bg-gray-200 object-cover object-center"
                        />
                        <div className="flex flex-col gap-2">
                          <div className="space-y-1 text-sm font-medium">
                            <h3 className="text-gray-900">
                              {room.value}{" "}
                              <span className="font-bold">{room.code}</span>{" "}
                            </h3>
                          </div>
                          <div className="flex items-center text-sm">
                            Number of {bookingType} :{" "}
                            <span className="ml-1 font-bold">
                              {selectedGuests?.length}
                            </span>
                            <div className=""></div>
                          </div>
                        </div>
                      </li>
                    ))}
                    <div className="sticky top-10 mb-4 flex max-h-72 flex-col rounded-lg border border-b border-gray-200 bg-white px-4 pb-4 pt-1">
                      <dl className="mt-4 flex flex-col gap-4 text-sm font-medium text-gray-500">
                        <div className="flex justify-between">
                          <dt>Subtotal</dt>
                          <dd className="text-gray-900">₹{subtotal}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt>Taxes (18%)</dt>
                          <dd className="text-gray-900">₹{tax.toFixed(2)}</dd>
                        </div>
                        <div className="flex flex-col items-center justify-between border-t border-gray-200 py-6 text-gray-900">
                          <dt className="w-full text-base">
                            Total (for {selectedGuests.length} {guestLabel}) - ₹
                            {total.toFixed(2)}
                          </dt>

                          <div className="pb-2">
                            <Select
                              defaultValue={selectedPaymentMethod}
                              onValueChange={(value) => {
                                setSelectedPaymentMethod(value);
                              }}
                            >
                              <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Choose payment Type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="offline">
                                  Pay at Hostel
                                </SelectItem>
                                <SelectItem value="online">
                                  Pay online
                                </SelectItem>
                              </SelectContent>
                            </Select>{" "}
                          </div>

                          <Button
                            onClick={() => {
                              if (!selectedGuests.length) {
                                return alert("Please Select atleast 1 Guest");
                              }
                              if (!selectedNumberOfRoomsOrBeds) {
                                return alert("Please Select Number of Rooms");
                              }
                              if (
                                selectedGuests.length > roomDetails?.totalBed
                              ) {
                                return alert(
                                  "Number of Selected Guests and Number of Selected Beds should be equal",
                                );
                              }
                              setPaymentTotal(total);
                              createBookingMutation.mutate({
                                hostelName: roomDetails.hostelName,
                                guestIds: selectedGuests.map((g) => g.id),
                                bookingDate: new Date().toISOString(),
                                bookedFromDt: checkin,
                                bookedToDt: checkout,
                                nosRooms: selectedNumberOfRoomsOrBeds,
                                remark: "",
                                bookingType: "BEDS",
                                roomId: roomDetails.id,
                                amount: total,
                                roomType: roomDetails?.roomType,
                                userId: userId,
                                userName,
                                userEmail,
                                subtotal: subtotal,
                                paymentStatus: "Payment Done",
                                paymentMode: selectedPaymentMethod,
                              });
                            }}
                          >
                            Confirm Booking
                          </Button>
                        </div>
                      </dl>

                      <div className="my-2 flex items-end justify-end"></div>
                    </div>
                  </ul>
                </section>
              </div>
            </Dialog>
            {/* Checkout form */}
          </main>
        ) : (
          <div className="flex min-h-[60vh] flex-col items-center justify-center text-green-500">
            <p className="text-base text-black sm:text-2xl">
              Your booking is successful
            </p>
            <div className="mt-6 flex items-center gap-4">
              <p className="typing-animation text-lg sm:text-3xl">
                You will be redirected to the booking page
              </p>
              <div className="mt-2 flex items-center gap-2">
                <div className="h-3 w-3 animate-bounce rounded-full bg-green-500"></div>
                <div className="h-3 w-3 animate-bounce rounded-full bg-green-500 delay-150"></div>
                <div className="h-3 w-3 animate-bounce rounded-full bg-green-500 delay-300"></div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }
}
