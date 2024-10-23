"use client";
import React from "react";
import Link from "next/link";
// @ts-ignore
import { RoomDetails } from "@prisma/client";
import { TbookingType } from "~/lib/utils";
import { useAppSelector } from "~/store";
import {
  FaCoffee,
  FaParking,
  FaBath,
  FaWifi,
  FaSnowflake,
  FaUsers,
  FaConciergeBell,
  FaShower,
  FaBan,
  FaTv,
} from "react-icons/fa";

export default function ProductHeroSlider({
  roomDetails,
  checkin,
  checkout,
  bookingType,
}: Readonly<{
  roomDetails: RoomDetails;
  checkin: Date;
  checkout: Date;
  bookingType: TbookingType;
}>) {
  const isLogin = useAppSelector((state: any) => state.auth.authState);

  const hostelName = roomDetails.hostelName ?? "";
  // const features = roomFeatures[hostelName as keyof typeof roomFeatures]?.features ?? [];

  const featuress = [
    { icon: FaCoffee, label: "Breakfast" },
    { icon: FaParking, label: "Free on-site parking" },
    { icon: FaBath, label: "Private bathroom" },
    { icon: FaWifi, label: "Free WiFi" },
    { icon: FaSnowflake, label: "Air conditioning" },
    { icon: FaUsers, label: "Family rooms" },
    { icon: FaConciergeBell, label: "Room service" },
    { icon: FaShower, label: "Shower" },
    { icon: FaBan, label: "Non-smoking rooms" },
    { icon: FaTv, label: "Flat-screen TV" },
  ];

  return (
    <div className="bg-white">
      <main className="mx-auto max-w-7xl sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-none">
          <div className="mb-5 flex items-center justify-center">
            <h1 className="w-fit text-2xl font-bold tracking-tight text-gray-900 md:text-3xl">
              {hostelName.replace(/_/g, " ")}
            </h1>
          </div>
          {/* Product */}
          <div className="flex flex-col gap-5 sm:flex-row">
            {/* Image gallery */}
            <div className="flex w-fit px-2 sm:px-0">
              <div className="mb-6 grid grid-cols-4 gap-4">
                <div className="col-span-2 row-span-2">
                  <img
                    src={roomDetails.roomImg[0]}
                    alt={hostelName.replace(/_/g, " ")}
                    className="h-full w-full rounded-lg object-cover"
                  />
                </div>
                <div className="col-span-2">
                  <img
                    src={roomDetails.roomImg[1]}
                    alt={hostelName.replace(/_/g, " ")}
                    className="h-full w-full rounded-lg object-cover"
                  />
                </div>
                <div className="col-span-1">
                  <img
                    src={roomDetails.roomImg[2]}
                    alt={hostelName.replace(/_/g, " ")}
                    className="h-full w-full rounded-lg object-cover"
                  />
                </div>
                <div className="col-span-1">
                  <img
                    src={roomDetails.roomImg[3]}
                    alt={hostelName.replace(/_/g, " ")}
                    className="h-full w-full rounded-lg object-cover"
                  />
                </div>
                <div className="col-span-4 grid grid-cols-3 gap-4">
                  <img
                    src={roomDetails.roomImg[4]}
                    alt={hostelName.replace(/_/g, " ")}
                    className="h-full w-full rounded-lg object-cover"
                  />
                  <img
                    src={roomDetails.roomImg[0]}
                    alt={hostelName.replace(/_/g, " ")}
                    className="h-full w-full rounded-lg object-cover"
                  />
                  <div className="relative">
                    <img
                      src={roomDetails.roomImg[1]}
                      alt={hostelName.replace(/_/g, " ")}
                      className="h-full w-full rounded-lg object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black bg-opacity-50">
                      <Link href={`/gallery`}>
                        <span className="text-lg font-semibold text-white">
                          +20 photos
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Product info */}
            <div className="flex flex-col gap-2 px-2 sm:px-0">
              <div className="flex gap-4 pt-4">
                <h2
                  className={`rounded-xl px-4 py-2 text-lg font-semibold text-gray-100 ${roomDetails?.totalBed !== null && roomDetails.totalBed > 0 ? "bg-green-500" : "bg-red-400"}`}
                >
                  {roomDetails?.totalBed !== null && roomDetails.totalBed > 0
                    ? " Available"
                    : "Not Available"}
                </h2>

                <h2 className="rounded-xl bg-yellow-400 px-4 py-2 text-lg font-semibold text-gray-700">
                  {roomDetails?.value}
                </h2>
              </div>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-2 ">
                {featuress.map((feature, index) => (
                  <div
                    key={index}
                    className="flex w-full items-center space-x-2 rounded-md border p-2 shadow-sm"
                  >
                    <feature.icon className="text-xl" />
                    <span className="w-full">{feature.label}</span>
                  </div>
                ))}
              </div>

              <form className="mb-2 mt-6">
                <div className="mt-10 flex">
                  <Link
                    href={
                      isLogin
                        ? `/checkout?id=${roomDetails.id}&checkin=${checkin}&checkout=${checkout}&type=${bookingType}`
                        : "/login"
                    }
                    passHref
                    className="w-full"
                  >
                    <button
                      type="submit"
                      className="hover:bg-primary-dark flex max-w-xs flex-1 items-center justify-center rounded-md border border-transparent bg-primary px-8 py-3 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-full"
                    >
                      Book Now
                    </button>
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
