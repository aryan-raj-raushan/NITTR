import React from 'react';
import ProfileCard from '../_components/Profile/ProfileCard';
import ManageGuests from '../_components/Profile/ManageGuests/ManageGuests';
import { api } from "~/trpc/server";

export default async function Page() {
    const { roomCharges } = await api.room.getAllRooms.mutate();

    return (
        <div className="h-full max-w-[1280px] mx-auto py-10 flex sm:flex-row flex-col gap-10 sm:px-2 px-5">
           <div className='sm:w-1/2 w-full'>
           <ProfileCard />
           </div>
            <div className='sm:w-1/2 w-full '>
                <ManageGuests roomCharges={roomCharges[1]} />
            </div>
        </div>
    );
};

// Mark the page for dynamic rendering
export const dynamic = 'force-dynamic';
