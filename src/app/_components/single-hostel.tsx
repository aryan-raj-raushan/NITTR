"use client";
import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { Tab } from "@headlessui/react";
import { classNames } from "~/lib/classNames";
import Link from "next/link";
import { GuestHouse, RoomDetails } from "@prisma/client";
import { TbookingType } from "~/lib/utils";
import { FaUser, FaBed } from "react-icons/fa";
import { AcIcon, GeyserIcon } from "~/components/Assets";
import Image from "next/image";
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

 
  return (
    <div className="bg-white">
      <main className="mx-auto max-w-7xl sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-none">
          {/* Product */}
          <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
            {/* Image gallery */}
            <Tab.Group as="div" className="flex flex-col-reverse">
              {/* Image selector */}
              <div className="mx-auto mt-6 w-full max-w-2xl lg:max-w-none">
                <Tab.List className="flex overflow-auto no-scrollbar gap-4 py-4 px-2">
                  {roomDetails.roomImg.map((image, index) => (
                    <Tab
                      key={image + index}
                      className="relative flex h-24 cursor-pointer items-center justify-center rounded-md bg-white text-sm font-medium uppercase text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring focus:ring-opacity-50 focus:ring-offset-4 min-w-40"
                    >
                      {({ selected }) => (
                        <>
                          <span className="sr-only">{image}</span>
                          <span className="absolute inset-0 overflow-hidden rounded-md">
                            <img
                              src={image}
                              alt=""
                              className="h-full w-full object-cover object-center"
                            />
                          </span>
                          <span
                            className={classNames(
                              selected ? "border-blue-800 " : "border-transparent",
                              "pointer-events-none absolute inset-0 border rounded-md ",
                            )}
                            aria-hidden="true"
                          />
                        </>
                      )}
                    </Tab>
                  ))}
                </Tab.List>
              </div>

              <Tab.Panels className="aspect-h-1 aspect-w-1 w-full">
                {roomDetails.roomImg.map((image, index) => (
                  <Tab.Panel key={image + index}>
                    <Image
                      src={image}
                      alt={hostelName.replace(/_/g, " ")!}
                      width={1000}
                      height={1000}
                      className="h-full w-full object-cover object-center sm:rounded-lg"
                    />
                  </Tab.Panel>
                ))}
              </Tab.Panels>
            </Tab.Group>

            {/* Product info */}
            <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 md:text-3xl">
                {hostelName.replace(/_/g, " ")}
              </h1>

              <div className="flex gap-4 pt-4">
                <h2 className="rounded-xl bg-gray-200 px-4 py-2 text-base font-semibold text-gray-700">
                  {roomDetails?.floor?.replace(/_/g, " ")}
                </h2>
                <h2
                  className={`rounded-xl px-4 py-2 text-lg font-semibold text-gray-100 ${roomDetails?.totalBed !== null && roomDetails.totalBed > 0 ? "bg-green-500" : "bg-red-400"}`}
                >
                  {roomDetails?.totalBed !== null && roomDetails.totalBed > 0 
                    ? " Available"
                    : "Not Available"}
                </h2>

                <h2 className="rounded-xl bg-gray-200 px-4 py-2 text-lg font-semibold text-gray-700">
                  {roomDetails?.value}
                </h2>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Amenities
                </h3>
                <ul className="mt-2 space-y-2">
                  <li className="flex items-center gap-2">
                    {" "}
                    <Image src={GeyserIcon} alt="geyser" className="h-5 w-5" />
                    {/* <FaHotTub /> */}
                    Geyser:{" "}
                    <span className="font-medium ">
                      {" "}
                      {roomDetails?.geaser}{" "}
                    </span>
                  </li>
                  <li className="flex items-start gap-2 ">
                    {" "}
                    {/* <FaHotTub /> */}
                    <Image src={AcIcon} alt="Ac" className="mt-1 h-5 w-5" />
                    AC: <span className="font-medium ">{roomDetails?.ac}</span>
                  </li>
                  {/* <li className="flex items-center gap-2">
                    <FaUser /> Max Adult Allowed:{" "}
                    <span className="font-medium">{roomDetails?.maxAdult}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <FaUser /> Max Child Allowed:
                    <span className="font-medium">{roomDetails?.maxChild}</span>
                  </li> */}
                  <li className="flex items-center gap-2">
                    <FaBed /> Occupancy:{" "}
                    <span className="font-medium">
                      {roomDetails?.occupancy}
                    </span>
                  </li>
                </ul>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900">
                About the room
                </h3>
                <p className="mt-2 text-base text-gray-700">
                  {roomDetails.remark}
                </p>
              </div>

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
                      (d:any, index:any) => (
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
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
