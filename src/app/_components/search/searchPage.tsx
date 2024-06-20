"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { formatGuests, formatRangeDate } from "~/utils";
import { useSearchParams } from 'next/navigation';
import { GuestHouse, RoomDetails, RoomType } from '@prisma/client';
import { api } from '~/trpc/react';
import AppPlaceCard from '../PlaceCard';
import SearchForm from '../SearchForm';
import { RouterOutputs } from '~/trpc/shared';
import { removeUnderscore } from '~/lib/utils';
import Loader from '~/components/ui/loader';

const SearchPage = () => {
  const searchParams = useSearchParams();
  const xcheckIn = searchParams.get('checkin');
  const xcheckOut = searchParams.get('checkout');
  const xchildren = searchParams.get('group_children');
  const xAdults = searchParams.get('group_adults');
  const xguests = { children: xchildren, adults: xAdults };
  const xlocation = searchParams.get('location') as GuestHouse;
  const xBookingType = searchParams.get('type');
  
  const [location, setLocation] = useState<string>('');
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [guests, setGuests] = useState<Object>();
  const [roomDetails, setRoomDetails] = useState<RouterOutputs["room"]["getRoomsByGuestHouse"]["roomDetails"]>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLocation(xlocation?.toString()!);
    if (xcheckIn) setCheckIn(new Date(xcheckIn?.toString()));
    if (xcheckOut) setCheckOut(new Date(xcheckOut?.toString()));
    if (xguests) setGuests(xguests);
  }, []);

  const getGuests = (guests: any) => {
    const totalGuests = formatGuests(guests, { noInfants: true });
    if (totalGuests) return `• ${totalGuests}`;
  };

  const getDates = (startDate: any, endDate: any) => {
    const dates = formatRangeDate(startDate, endDate);
    if (dates) return `• ${dates}`;
  };

  const { data, isLoading } = api.room.getRoomsByGuestHouse.useQuery(
    { guestHouse: xlocation },
    {
      onSuccess: async (data) => {
        if (data.roomDetails && data.roomDetails.length > 0) {
          setRoomDetails(data.roomDetails);
          setLoading(false);
        }
      },
    }
  );

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen"><Loader /></div>;
  }
  return (
    <div className="flex flex-col min-h-screen  max-w-[1280px] mx-auto">
      <main className="grid grid-cols-1 duration-500 ">
        <div className='pt-10 '>
          <SearchForm />
        </div>
        <div className="px-4 py-8 duration-500 lg:py-12">
          <span className="inline-block mb-2 text-lg text-gray-500">
            Stays {checkIn && getDates(checkIn, checkOut)} {guests && getGuests(guests)}
          </span>
          <h1 className="mb-2 text-sm md:text-2xl font-semibold lg:text-3xl lg:mb-7">
            Stays in {removeUnderscore(location)}
          </h1>
          <p className="mb-4 text-2xl text-gray-400">
            Review COVID-19 travel restrictions before you book.{' '}
            <Link href="/">Learn more</Link>
          </p>
          <section className='grid md:grid-cols-3 lg:grid-cols-4 gap-5'>
            {roomDetails?.map((room, index) => (
              <div key={index}>
                <AppPlaceCard
                  key={room.id}
                  data={room}
                  img={room.roomImg[index]}
                  room={room}
                  checkIn={checkIn}
                  checkOut={checkOut}
                  xBookingType={xBookingType}
                />
              </div>
            ))}
          </section>
        </div>
      </main>
    </div>
  );
};

export default SearchPage;
