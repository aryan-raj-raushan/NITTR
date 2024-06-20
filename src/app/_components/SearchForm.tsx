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
import { format } from "date-fns";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
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
import bannerImg from "public/banner.jpg";
import Image from "next/image";
import { useState } from "react";

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

function SearchForm() {
  const [selectedGuestHouse, setSelectedGuestHouse] = useState<GuestHouse>();
  const utils = api.useContext();
  const router = useRouter();
  const searchParams = useSearchParams();
  const xcheckIn = searchParams.get("checkin");
  const xcheckOut = searchParams.get("checkout");
  const xchildren = searchParams.get("group_children");
  const xAdults = searchParams.get("group_adults");
  const xguests = { children: xchildren, adults: xAdults };
  const xlocation = searchParams.get("location");
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      location: xlocation ?? "",
      dates: {
        from: xcheckIn ? new Date(xcheckIn?.toString()) : new Date(),
        to: xcheckOut ? new Date(xcheckOut?.toString()) : new Date(),
      },
      adults: xAdults ?? "1",
      children: xchildren ?? "0",
      rooms: "1",
      beds: "1",
    },
  });
  const getRoomDetailsQuery = api.room.getRoomByDetails.useMutation();

  function onSubmit(values: z.infer<typeof formSchema>) {

    const checkin_monthday = values.dates.from.getDate().toString();
    const checkin_month = (values.dates.from.getMonth() + 1).toString();
    const checkin_year = values.dates.from.getFullYear().toString();
    const checkout_monthday = values.dates.to.getDate().toString();
    const checkout_month = (values.dates.to.getMonth() + 1).toString();
    const checkout_year = values.dates.to.getFullYear().toString();


    const checkin = values.dates.from;
    const checkout = values.dates.to;
    let bookingType: "ROOM" | "BEDS";

    if (selectedGuestHouse == "EXECUTIVE_GUEST_HOUSE") {
      bookingType = "ROOM";
    } else {
      bookingType = "BEDS";
    }

    getRoomDetailsQuery.mutate(
      {
        guestHouse: values.location as GuestHouse,
        // bookedFrom: checkin,
        // bookedTo: checkout,
        bookingType,
        quantity:
          selectedGuestHouse == GuestHouse.EXECUTIVE_GUEST_HOUSE
            ? +values.rooms!
            : +values.beds!,
      },
      {
        onSuccess: async ({ roomDetails }) => {
          if (roomDetails) {
            const queryParameters = new URLSearchParams();
            queryParameters.set("checkin", checkin.toString());
            queryParameters.set("checkout", checkout.toString());
            queryParameters.set("type", bookingType.toString());
            queryParameters.set("location", values.location);
            router.push(`/search?${queryParameters.toString()}`);
          } 
          // else {
          //   alert("rooms unavailable for the selected inputs");
          // }
        },
      },
    );
    utils.room.getRoomsByGuestHouse.invalidate();
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="relative flex w-full flex-col items-center justify-center space-x-0 space-y-4 rounded-lg text-black lg:mx-auto lg:max-w-6xl lg:flex-row lg:space-x-2 lg:space-y-0"
      >
        <div className="grid w-full items-center gap-1.5 lg:max-w-sm">
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem
                onChange={(v) => {
                  //@ts-ignore
                  setSelectedGuestHouse(v.target.value);
                }}
              >
                <FormLabel className="flex font-extrabold">
                  Location
                  <BedDoubleIcon className="ml-2 h-4 w-4 text-black" />
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
                  <SelectContent className="w-full">
                    {Object.keys(GuestHouse).map((g, index) => {
                      return (
                        <SelectItem
                          key={g + index}
                          value={g}
                          className="w-full capitalize"
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

        <div className="grid w-full flex-1 items-center gap-1.5 lg:max-w-sm">
          <FormField
            control={form.control}
            name="dates"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="font-extrabold">Dates</FormLabel>
                <FormMessage />

                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        id="date"
                        name="dates"
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal lg:w-[300px]",
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
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      initialFocus
                      mode="range"
                      selected={field.value}
                      defaultMonth={field.value.from}
                      onSelect={field.onChange}
                      numberOfMonths={2}
                      disabled={(date) =>
                        date < new Date(new Date().setHours(0, 0, 0, 0))
                      }
                    />
                  </PopoverContent>
                </Popover>
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
                  <FormLabel className="font-extrabold">Guests</FormLabel>
                  <FormMessage />
                  <FormControl>
                    <Input type="number" placeholder="Adults" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <div className="mt-auto">
            <Button
              type="submit"
              className="bg-blue-600 text-base hover:bg-red-400"
            >
              Search
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}

export default SearchForm;
