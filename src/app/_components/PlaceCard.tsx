import Image from "next/image";
import Link from "next/link";
import { FaBed } from "react-icons/fa";
import { MdBedroomParent } from "react-icons/md";
import { MdOutlineEventAvailable } from "react-icons/md";
// import { SiLevelsdotfyi } from "react-icons/si";
import React from "react";
const AppPlaceCard = ({
  data,
  img,
  checkIn,
  checkOut,
  xBookingType,
  availability
}: any) => {
  return (
    <div className="drop-shadow-gray-400 flex max-w-xs flex-col rounded-xl border border-gray-300  bg-gradient-to-tr from-slate-200 via-white to-gray-300 p-4 pt-4 drop-shadow-md hover:drop-shadow-xl">
      {/* left - image */}
      <div className="relative mb-2 h-52 w-full sm:h-44 md:mb-0 ">
        <Image
          priority={true}
          src={img}
          alt={data.value}
          width={1000}
          height={1000}
          className="h-44 w-full rounded-xl"
        />
      </div>
      {/* right - detail */}
      <div className="flex w-fit flex-col gap-4 pt-4">
        {/* detail top */}
        <div className="flex w-auto flex-col gap-2">
          <div className="flex items-center justify-between pr-4">
            <span className="flex items-center text-sm font-medium text-gray-500 ">
              {" "}
              <MdBedroomParent className="mr-1 text-2xl" /> {data.value}
            </span>
            <div className="flex items-center gap-2 pl-2">
              <FaBed className="text-xl" />
              <span className="font-semibold text-sm">{data.occupancy} BED</span>
            </div>
          </div>
          <div className="flex items-center">
            <span className="flex items-center text-base font-semibold">
              <MdOutlineEventAvailable className="mr-1 text-2xl" />
              Beds Available - {availability}
            </span>
          </div>
          <h3 className="flex pl-2 text-sm">{data.remark}</h3>
        </div>

        {/* detail bottom */}

        <div className="order-first flex w-full flex-col gap-3 sm:order-none">
          <div className="flex items-center justify-center w-full">
            <Link
              hidden={!data?.totalBed}
              href={`/hostel/${data?.id}?checkin=${checkIn}&checkout=${checkOut}&type=${xBookingType}`}
              className="flex w-full"
            >
              <button className="w-full mx-2 rounded-lg bg-primaryBackground p-2 px-4 text-white duration-300 hover:bg-blue-600 active:scale-90" >
                Book Now
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppPlaceCard;
