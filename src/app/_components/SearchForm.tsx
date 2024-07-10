"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { addDays } from "date-fns";
// @ts-ignore
import { GuestHouse } from "@prisma/client";
import { api } from "~/trpc/react";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export const formSchema = z.object({
  location: z.string().min(2, { message: "Please Select a Value" }),
  dates: z.object({
    from: z.date().optional(),
    to: z.date().optional(),
  }).optional(),
  adults: z
    .string()
    .min(1, {
      message: "Please select at least 1 adult",
    })
    .max(12, { message: "Max 12 adults Occupancy" }),
  children: z.string().min(0).max(12, {
    message: "Max 12 children Occupancy",
  }),
  rooms: z
    .string()
    .min(1, {
      message: "Please select at least 1 room",
    })
    .optional(),
  beds: z
    .string()
    .min(1, {
      message: "Please select at least 1 bed",
    })
    .optional(),
});

interface SearchFormProps {
  aboveClass?: string;
  belowClass?: string;
  guests?: any;
}

const SearchForm: React.FC<SearchFormProps> = ({
  aboveClass,
  belowClass,
  guests,
}) => {
  const [selectedGuestHouse, setSelectedGuestHouse] = useState<GuestHouse>();
  const [showGuestPopDown, setShowGuestPopDown] = useState(false);
  const utils = api.useContext();
  const router = useRouter();
  const searchParams = useSearchParams();
  const xcheckIn = searchParams.get("checkin");
  const xcheckOut = searchParams.get("checkout");
  const xchildren = searchParams.get("group_children");
  const xAdults = searchParams.get("group_adults");
  const xlocation = searchParams.get("location");
  const initialGuestLength = guests ?? xAdults ?? "1";
  const [guestLength, setGuestLength] = useState(initialGuestLength);
  const [rooms, setRooms] = useState("1");

  const today: Date = new Date(new Date().setHours(0, 0, 0, 0));
  const initialFrom: Date = xcheckIn ? new Date(xcheckIn.toString()) : today;
  const initialTo = xcheckOut
    ? new Date(xcheckOut.toString())
    : addDays(initialFrom, 1);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      location: xlocation ?? "",
      dates: {
        from: initialFrom,
        to: initialTo,
      },
      adults: guestLength.toString(),
      children: xchildren ?? "0",
      rooms: "1",
      beds: "1",
    },
  });

  useEffect(() => {
    setGuestLength(guests ?? xAdults ?? "1");
  }, [guests, xAdults]);

  const getRoomDetailsQuery = api.room.getRoomByDetails.useMutation();

  function onSubmit(values: z.infer<typeof formSchema>) {
    const checkin: Date = values.dates?.from ?? today;
    const checkout: Date = values.dates?.to ?? addDays(today, 1);
    let bookingType: "ROOM" | "BEDS";

    if (selectedGuestHouse === "EXECUTIVE_GUEST_HOUSE") {
      bookingType = "ROOM";
    } else {
      bookingType = "BEDS";
    }

    getRoomDetailsQuery.mutate(
      {
        guestHouse: values.location as GuestHouse,
        bookingType,
        quantity:
          selectedGuestHouse === GuestHouse.EXECUTIVE_GUEST_HOUSE
            ? +values.rooms!
            : +values.beds!,
      },
      {
        onSuccess: async ({ roomDetails }) => {
          if (roomDetails) {
            const value = guestLength ?? values.adults;
            const queryParameters = new URLSearchParams();
            queryParameters.set("checkin", checkin.toString());
            queryParameters.set("checkout", checkout.toString());
            queryParameters.set("type", bookingType.toString());
            queryParameters.set("location", values.location);
            queryParameters.set("group_adults", value);
            router.push(`/search?${queryParameters.toString()}`);
          }
        },
      }
    );
    utils.room.getRoomsByGuestHouse.invalidate();
  }

  useEffect(() => {
    const updateRooms = () => {
      const guestCount = +guestLength;
      let maxRooms = guestCount; // One person can stay in one room
      let minRooms = 1; // Minimum is always 1 room
  
      if (selectedGuestHouse === "SARAN_GUEST_HOUSE") {
        // For Saran Guest House
        maxRooms = Math.min(guestCount, 3); // Max 3 rooms (single, double, triple)
      } else if (
        selectedGuestHouse === "EXECUTIVE_GUEST_HOUSE" ||
        selectedGuestHouse === "VISVESVARAYA_GUEST_HOUSE"
      ) {
        // For Executive and Visvesvaraya Guest Houses
        maxRooms = guestCount; // Max rooms (1 guest per room)
      }
  
      // Ensure current room count is within the valid range
      const currentRooms = Math.max(minRooms, Math.min(+rooms, maxRooms));
      setRooms(currentRooms.toString());
    };
  
    updateRooms();
  }, [selectedGuestHouse, guestLength, rooms]);

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className={`relative flex w-fit gap-5 flex-col items-start sm:flex-row sm:items-center ${aboveClass}`}
    >
      <div className="flex flex-col items-center  sm:flex-row w-full gap-2">
        <div className="flex items-center gap-1.5">
          <div className="w-fit ">
            <label htmlFor="location" className="ml-1 flex font-extrabold">
              Location
            </label>
            <select
              id="location"
              className="flex max-w-64 w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              {...form.register("location", {
                onChange: (e) =>
                  setSelectedGuestHouse(e.target.value as GuestHouse),
              })}
            >
              <option value="" disabled>
                Select Guest House
              </option>
              {Object.keys(GuestHouse).map((g, index) => (
                <option key={g + index} value={g}>
                  {g.split("_").join(" ")}
                </option>
              ))}
            </select>
            <p className="text-red-500 text-sm">
              {form.formState.errors.location?.message as string}
            </p>
          </div>
        </div>

        <div className="flex w-fit items-center gap-1.5">
          <div className="w-full">
            <label htmlFor="dates" className="font-extrabold">
              Dates
            </label>
            <div className="relative">
              <DatePicker
                selectsRange
                minDate={today}
                dateFormat={"dd/MM/yyyy"}
                startDate={form.watch("dates.from")}
                endDate={form.watch("dates.to")}
                onChange={(dates: [Date | null, Date | null]) => {
                  const [start, end] = dates;
                  form.setValue("dates.from", start as Date);
                  form.setValue("dates.to", end as Date);
                }}
                placeholderText="Select your dates"
                className="min-w-48 px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              />
            </div>
          </div>
        </div>

        <div className="flex w-10">
          <div>
            <label htmlFor="adults" className="font-extrabold">
              Adults
            </label>
            <div
              className="cursor-pointer"
              onClick={() => setShowGuestPopDown(!showGuestPopDown)}
            >
              <input
                type="number"
                id="adults"
                className="block w-12 px-2 py-1 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm text-center"
                {...form.register("adults")}
                value={guestLength}
                readOnly
              />
            </div>
            <p className="text-red-500 text-sm">
              {form.formState.errors.adults?.message as string}
            </p>
          </div>
        </div>
      </div>
      {showGuestPopDown && (
  <div className="absolute top-16 left-0 z-10 w-full bg-white border border-gray-300 rounded-md shadow-md p-4">
    <div className="flex justify-between items-center mb-4">
      <label htmlFor="adults" className="font-extrabold">Adults</label>
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="px-2 py-1 bg-gray-200 rounded"
          onClick={() => setGuestLength((prev:any) => Math.max(+prev - 1, 1))}
        >
          -
        </button>
        <input
          type="number"
          id="adults"
          className="block w-12 px-2 py-1 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm text-center"
          value={guestLength}
          onChange={(e) => setGuestLength(e.target.value)}
          min="1"
        />
        <button
          type="button"
          className="px-2 py-1 bg-gray-200 rounded"
          onClick={() => setGuestLength((prev:any) => +prev + 1)}
        >
          +
        </button>
      </div>
    </div>
    <div className="flex justify-between items-center mb-4">
      <label htmlFor="rooms" className="font-extrabold">Rooms</label>
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="px-2 py-1 bg-gray-200 rounded"
          onClick={() => setRooms((prev) => Math.max(+prev - 1, 1).toString())}
        >
          -
        </button>
        <input
          type="number"
          id="rooms"
          className="block w-12 px-2 py-1 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm text-center"
          value={rooms}
          onChange={(e) => setRooms(Math.min(+e.target.value, guestLength).toString())}
          min="1"
          max={guestLength}
        />
        <button
          type="button"
          className="px-2 py-1 bg-gray-200 rounded"
          onClick={() => setRooms((prev) => Math.min(+prev + 1, guestLength).toString())}
        >
          +
        </button>
      </div>
    </div>
    <button
      type="button"
      className="bg-primaryBackground text-base hover:bg-blue-600 px-4 py-2 rounded-md text-white"
      onClick={() => setShowGuestPopDown(false)}
    >
      Done
    </button>
  </div>
)}

      <div className={`mt-auto flex justify-end text-right ${belowClass} w-fit`}>
        <button
          type="submit"
          className="bg-primaryBackground text-base hover:bg-blue-600 px-4 py-2 rounded-md text-white"
        >
          Search
        </button>
      </div>
    </form>
  );
};

export default SearchForm;
