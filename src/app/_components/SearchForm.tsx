"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "~/components/ui/button";
import { BedDoubleIcon, CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { addDays, format, isAfter } from "date-fns";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { cn } from "~/lib/utils";
import { Calendar } from "~/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { GuestHouse } from "@prisma/client";
import { api } from "~/trpc/react";
import { useEffect, useState } from "react";
import { CustomInput } from "~/components/ui/CustomInput";

export const formSchema = z.object({
  location: z.string().min(2, { message: "Please Select a Value" }),
  dates: z.object({
    from: z.date(),
    to: z.date(),
  }),
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
    const checkin: Date = values.dates.from;
    const checkout: Date = values.dates.to;
    let bookingType: "ROOM" | "BEDS";

    if (selectedGuestHouse == "EXECUTIVE_GUEST_HOUSE") {
      bookingType = "ROOM";
    } else {
      bookingType = "BEDS";
    }

    getRoomDetailsQuery.mutate(
      {
        guestHouse: values.location as GuestHouse,
        bookingType,
        quantity:
          selectedGuestHouse == GuestHouse.EXECUTIVE_GUEST_HOUSE
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
      },
    );
    utils.room.getRoomsByGuestHouse.invalidate();
  }

  const validateDateRange = (value: any) => {
    if (!value.from || !value.to) {
      return "Please select a range of at least one day";
    }
    if (!isAfter(value.to, value.from)) {
      return "End date must be after start date";
    }
    return true;
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={`relative flex w-full flex-col items-start gap-3 sm:flex-row sm:items-center ${aboveClass} `}
      >
        <div className="flex flex-col items-center gap-2 sm:flex-row ">
          <div className="flex w-full items-center gap-1.5 lg:max-w-44">
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem
                  onChange={(v: any) => {
                    setSelectedGuestHouse(v.target.value as GuestHouse);
                  }}
                >
                  <FormLabel className="ml-1 flex font-extrabold">
                    Location
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Guest House" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="w-fit">
                      {Object.keys(GuestHouse).map((g, index) => {
                        return (
                          <SelectItem
                            key={g + index}
                            value={g}
                            className="w-fit max-w-fit capitalize"
                          >
                            {g.split("_").join(" ")}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex w-fit items-center gap-1.5">
            <FormField
              control={form.control}
              name="dates"
              rules={{ validate: validateDateRange }}
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="font-extrabold">Dates</FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          id="date"
                          name="dates"
                          variant={"outline"}
                          className={cn(
                            "w-fit justify-start text-left font-normal",
                            !field.value.from && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-3 h-4 w-4 opacity-50" />
                          {field.value?.from ? (
                            field.value?.to ? (
                              <>
                                {format(field.value?.from, "LLL dd, y")} -{" "}
                                {format(field.value?.to, "LLL dd, y")}
                              </>
                            ) : (
                              format(field.value?.from, "LLL dd, y")
                            )
                          ) : (
                            <span>Select your dates</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          initialFocus
                          mode="range"
                          selected={field.value}
                          defaultMonth={field.value.from}
                          onSelect={(range: any) => {
                            if (!range?.from) {
                              field.onChange({
                                from: initialFrom,
                                to: initialTo,
                              });
                            } else if (!range.to) {
                              field.onChange({
                                from: range.from,
                                to: addDays(range.from, 1),
                              });
                            } else {
                              field.onChange(range);
                            }
                          }}
                          numberOfMonths={2}
                          disabled={(date) => date < today}
                        />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <div className="flex w-full items-center space-x-2">
            <div className="tems-center  grid flex-1">
              <FormField
                control={form.control}
                name="adults"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="font-extrabold">Adults</FormLabel>
                    <FormControl>
                      <CustomInput
                        type="number"
                        placeholder="Adults"
                        guestLength={guestLength}
                        setGuestLength={(value: any) => {
                          field.onChange(value);
                          setGuestLength(value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        <div className={`mt-auto flex justify-end text-right ${belowClass}`}>
          <Button
            type="submit"
            className="min-w-32 bg-primaryBackground text-base hover:bg-blue-600"
          >
            Search
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default SearchForm;
