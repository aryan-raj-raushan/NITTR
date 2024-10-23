"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { formatRangeDate } from "~/utils";
import { useSearchParams } from "next/navigation";
// @ts-ignore
import { GuestHouse } from "@prisma/client";
import { api } from "~/trpc/react";
import AppPlaceCard from "../PlaceCard";
import SearchForm from "../SearchForm";
import { removeUnderscore } from "~/lib/utils";
import Loader from "~/components/ui/loader";
import { startOfDay } from "date-fns";

const SearchPage = ({ bookings }: any) => {
  const searchParams = useSearchParams();
  const xcheckIn = searchParams.get("checkin");
  const xcheckOut = searchParams.get("checkout");
  const xAdults = searchParams.get("group_adults");
  const xlocation = searchParams.get("location") as GuestHouse;
  const xBookingType = searchParams.get("type");

  const [location, setLocation] = useState<string>("");
  const [checkIn, setCheckIn] = useState<any>();
  const [checkOut, setCheckOut] = useState<any>();
  const [guests, setGuests] = useState<any>();
  const [roomDetails, setRoomDetails] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [availableRooms, setAvailableRooms] = useState<any>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setLocation(xlocation?.toString()!);
    if (xcheckIn) setCheckIn(new Date(xcheckIn.toString()));
    if (xcheckOut) setCheckOut(new Date(xcheckOut.toString()));
    if (xAdults) setGuests(Number(xAdults));
  }, [xcheckIn, xcheckOut, xAdults, xlocation]);

  const { data, isLoading } = api.room.getRoomsByGuestHouse.useQuery(
    { guestHouse: xlocation },
    {
      enabled: !!location,
      onSuccess: (data) => {
        if (data.roomDetails && data.roomDetails.length > 0) {
          setRoomDetails(data.roomDetails);
          setLoading(false);
        }
      },
    },
  );

  useEffect(() => {
    if (!loading && roomDetails.length > 0) {
      const confirmedBookings = bookings?.filter(
        (booking: any) => booking.bookingStatus === "CONFIRMED",
      );
      const locationFilteredBookings = confirmedBookings?.filter(
        (booking: any) => booking.hostelName === location,
      );

      const calculateAvailability = (
        roomDetails: any,
        locationFilteredBookings: any,
        checkInDate: Date,
        checkOutDate: Date,
      ) => {
        return roomDetails.map((roomDetail: any) => {
          // let availableRooms = roomDetail.totalRoom;
          let availableRooms = roomDetail.totalBed;

          locationFilteredBookings.forEach((booking: any) => {
            const bookedFrom = startOfDay(new Date(booking.bookedFromDt));
            const bookedTo = startOfDay(new Date(booking.bookedToDt));
            const desiredFrom = startOfDay(new Date(checkInDate));
            const desiredTo = startOfDay(new Date(checkOutDate));   

              if (desiredFrom < bookedTo && desiredTo > bookedFrom) {
                if (booking.roomType === roomDetail.roomType) {
                  // availableRooms -= 1;
                  // availableRooms -= booking.totalRoom;
                  availableRooms -= booking.bookedBed;
                }
              }
            });
          return {
            roomType: roomDetail.roomType,
            availableRooms: availableRooms,
          };
        });
      };

      const availability = calculateAvailability(
        roomDetails,
        locationFilteredBookings,
        checkIn,
        checkOut,
      );
      setAvailableRooms(availability);
    }
  }, [loading, roomDetails, bookings, location, checkIn, checkOut]);

  //
  const getDates = (startDate: any, endDate: any) => {
    const dates = formatRangeDate(startDate, endDate);
    if (dates) return `• ${dates}`;
  };

  const filteredRooms: any = roomDetails?.filter(
    (room: any) => guests <= room?.totalBed,
  );


  return (
    <>
      {loading ? (
        <div className="flex min-h-screen items-center justify-center">
          <Loader />
        </div>
      ) : (
        <div className="mx-auto flex min-h-screen  max-w-[1280px] flex-col px-5">
          <main className="flex flex-col ">
            <div className="pt-10 flex justify-center">
            <SearchForm aboveClass="flex-col justify-start" belowClass="" setErrorMessage={setErrorMessage} />
                  {errorMessage && (
                    <p className="text-red-500 text-sm">{errorMessage}</p>
                  )}
            </div>
            <div className="px-0 pb-8 pt-4 duration-500  sm:px-4 lg:pt-8">
              <span className="mb-2 inline-block text-lg text-gray-500">
                Stays {checkIn && getDates(checkIn, checkOut)}{" "}
                {/* {guests && getGuests(guests)} */}
              </span>
              <h1 className="mb-2 text-sm font-semibold md:text-2xl lg:mb-4 lg:text-3xl">
                Stays in {removeUnderscore(location)}
              </h1>
              {/* <p className="mb-4 text-2xl text-gray-400">
                Review COVID-19 travel restrictions before you book.{" "}
                <Link href="/">Learn more</Link>
              </p> */}
              <section className="grid sm:gap-48 gap-5 md:grid-cols-3 lg:grid-cols-4">
                {loading ? (
                  <p>Loading...</p>
                ) : filteredRooms?.length > 0 ? (
                  filteredRooms.map((room: any, index: number) => (
                    <div key={index}>
                      <AppPlaceCard
                        key={room.id}
                        data={room}
                        img={room.roomImg[index]}
                        room={room}
                        checkIn={checkIn}
                        checkOut={checkOut}
                        xBookingType={xBookingType}
                        availability={
                          availableRooms.find(
                            (ar: any) => ar.roomType === room.roomType,
                          )?.availableRooms
                        }
                      />
                    </div>
                  ))
                ) : (
                  <p>
                    Not available any room for this date and guests. Please
                    select another date or fewer guests to book a room.
                  </p>
                )}
              </section>
            </div>
          </main>
        </div>
      )}
    </>
  );
};

export default SearchPage;
