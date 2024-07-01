import React from 'react';
import { api } from "~/trpc/server";
import ManageHotel from '~/app/_components/admin/hotel/ManageHotel/ManageHotel';

export default async function Page() {
      
  const { roomDetails } = await api.room.getAllRooms.mutate();

    return (
        <section className="h-full max-w-[1280px] mx-auto py-10">
         <ManageHotel roomDetails={roomDetails}/>
        </section>
    );
};

export const dynamic = 'force-dynamic';