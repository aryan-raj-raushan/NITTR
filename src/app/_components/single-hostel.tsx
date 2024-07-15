"use client";
import React from "react";
import { classNames } from "~/lib/classNames";
import Link from "next/link";
// @ts-ignore
import {  RoomDetails } from "@prisma/client";
import { TbookingType } from "~/lib/utils";
import { useAppSelector } from "~/store";


const roomFeatures = {
  EXECUTIVE_GUEST_HOUSE: {
    description:
      "Experience comfort and convenience in our thoughtfully appointed single room at Saran Guesthouse, nestled within the serene campus of NITTTR Bhopal. Perfect for solo travelers seeking a peaceful retreat, our single room offers a cozy sanctuary equipped with modern amenities for a relaxing stay. Immerse yourself in tranquility while enjoying easy access to nearby attractions and facilities. Book your stay with us for a rejuvenating experience in the heart of Bhopal.",
    features: [
      "Double Bed: Sink into plush bedding for a restful night's sleep",
      "Ensuite Bathroom: Enjoy the convenience of a private bathroom equipped with modern amenities.",
      "Workspace: Stay productive with a dedicated workspace, ideal for business travelers.",
      "Complimentary Wi-Fi: Stay connected with high-speed internet access throughout your stay.",
      "Air Conditioning: Stay cool and comfortable in any season.",
    ],
  },
  SARAN_GUEST_HOUSE: {
    description:
      "Discover spacious and cozy double rooms at NITTTR Bhopal, ideal for couples or friends traveling together. Enjoy a comfortable stay with modern amenities. Book your room now!",
    features: [
      "attached toilets and bathrooms",
      "It has separate kitchen and dining facility",
      " All the rooms are air conditioned and equipped with all modern amenities.",
    ],
  },
  VISVESVARAYA_GUEST_HOUSE: {
    description:
      "It has G +1 floor with 26 double bedded rooms with attached toilets and bathrooms. It has separate kitchen and dining facility. All the rooms are air conditioned and equipped with all modern amenities.",
    features: [
      "attached toilets and bathrooms",
      "It has separate kitchen and dining facility",
      " All the rooms are air conditioned and equipped with all modern amenities.",
    ],
  },
};

import { FaCoffee, FaParking, FaBath, FaWifi, FaSnowflake, FaUsers, FaConciergeBell, FaShower, FaBan, FaTv } from 'react-icons/fa';



export default function ProductHeroSlider({
  roomDetails,
  checkin,
  checkout,
  bookingType,
}: {
  roomDetails: RoomDetails;
  checkin: Date;
  checkout: Date;
  bookingType: TbookingType;
}) {
  const isLogin = useAppSelector((state: any) => state.auth.authState);

  const hostelName = roomDetails.hostelName ?? "";
  const features = roomFeatures[hostelName as keyof typeof roomFeatures]?.features ?? [];

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
          <div className="flex items-center justify-center mb-5">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 md:text-3xl w-fit">
              {hostelName.replace(/_/g, " ")}
            </h1>
          </div>
          {/* Product */}
          <div className="flex gap-5">
            {/* Image gallery */}
            <div className="flex w-fit">
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="col-span-2 row-span-2">
                  <img
                    src={roomDetails.roomImg[0]}
                    alt={hostelName.replace(/_/g, " ")}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <div className="col-span-2">
                  <img
                    src={roomDetails.roomImg[1]}
                    alt={hostelName.replace(/_/g, " ")}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <div className="col-span-1">
                  <img
                    src={roomDetails.roomImg[2]}
                    alt={hostelName.replace(/_/g, " ")}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <div className="col-span-1">
                  <img
                    src={roomDetails.roomImg[3]}
                    alt={hostelName.replace(/_/g, " ")}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <div className="col-span-4 grid grid-cols-3 gap-4">
                  <img
                    src={roomDetails.roomImg[4]}
                    alt={hostelName.replace(/_/g, " ")}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <img
                    src={roomDetails.roomImg[0]}
                    alt={hostelName.replace(/_/g, " ")}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <div className="relative">
                    <img
                      src={roomDetails.roomImg[1]}
                      alt={hostelName.replace(/_/g, " ")}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                      <Link href={`/gallery`}>
                        <span className="text-white text-lg font-semibold">+20 photos</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Product info */}
            <div className="flex flex-col gap-2">

              
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
              <div className="grid grid-cols-2 md:grid-cols-2 gap-4 ">
                {featuress.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2 p-2 border rounded-md shadow-sm w-full">
                    <feature.icon className="text-xl" />
                    <span className="w-full">{feature.label}</span>
                  </div>
                ))}
              </div>

              {/* <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  About the room
                </h3>
                <p className="mt-2 text-base text-gray-700">
                  {roomDetails.remark}
                </p>
              </div> */}

              <form className="mt-6">
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
              {/* 
              <section aria-labelledby="details-heading" className="mt-12">
                <h2
                  id="details-heading"
                  className="text-lg font-semibold text-gray-900"
                >
                  Additional Details
                </h2>
                <Accordion type="single" collapsible className="mt-4 w-full">
                  <AccordionItem value="item-2">
                    <AccordionTrigger className="text-base font-medium text-gray-700">
                      Features
                    </AccordionTrigger>
                    {features.map(
                      (d: any, index: any) => (
                        <AccordionContent
                          key={d + index}
                          className="mt-2 text-sm text-gray-600"
                        >
                          {d}
                        </AccordionContent>
                      ),
                    )}
                  </AccordionItem>
                </Accordion>
              </section> */}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
