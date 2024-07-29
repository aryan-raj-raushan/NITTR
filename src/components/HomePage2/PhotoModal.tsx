import Link from "next/link";
import React, { useState, useEffect, Suspense } from "react";
import { FaArrowRight } from "react-icons/fa";
import { motion } from "framer-motion";
import { slideInFromLeft } from "~/utils/motion";
import { FaArrowLeft } from "react-icons/fa6";
import Image from "next/image";
import SearchForm from "~/app/_components/SearchForm";
import { FaCoffee, FaParking, FaBath, FaWifi, FaSnowflake, FaUsers, FaConciergeBell, FaShower, FaBan, FaTv } from 'react-icons/fa';

import HeroBannerOne from "../../../public/hero_banner_1.webp"
import HeroBannerTwo from "../../../public/hero_banner_2.webp"
import HeroBannerThree from "../../../public/hero_banner_3.webp"

import ExecutiveOne from "../Assets/images/executive/executive.jpg";
import ExecutiveTwo from "../Assets/images/executive/executive2.jpg";
import ExecutiveThree from "../Assets/images/executive/executive3.jpg";
import ExecutiveFour from "../Assets/images/executive/executive4.jpg";

import SaranOne from "../Assets/images/saran/saran1.jpg";
import SaranTwo from "../Assets/images/saran/saran2.jpg";
import SaranThree from "../Assets/images/saran/saran3.jpg";
import SaranFour from "../Assets/images/saran/saran4.jpg";
import SaranFive from "../Assets/images/saran/saran5.jpg";

import VishOne from "../Assets/images/vish/vish1.jpg";
import VishTwo from "../Assets/images/vish/vish2.jpg";
import VishThree from "../Assets/images/vish/vish3.jpg";
import VishFour from "../Assets/images/vish/vish4.jpg";

const saranRoomPictures = [
  SaranOne,
  SaranTwo,
  SaranThree,
  SaranFour,
  SaranFive
];

const executeRoomPictures = [
  ExecutiveOne,
  ExecutiveTwo,
  ExecutiveThree,
  ExecutiveFour
];

const viswesawraiyaguesthousePictures = [
  VishOne,
  VishTwo,
  VishThree,
  VishFour
];

const Choices = [
  {
    id: 1,
    src: HeroBannerOne,
    title: "Saran Guest House",
    description:
      "A cozy and well-equipped guest house offering a comfortable stay.",
    images: saranRoomPictures,
  },
  {
    id: 2,
    src: HeroBannerThree,
    title: "Visvesvaraya Guest House",
    description:
      "Elegant guest house with modern amenities for a pleasant experience.",
    images: viswesawraiyaguesthousePictures,
  },
  {
    id: 3,
    src: HeroBannerTwo,
    title: "Executive Guest House",
    description:
      "Luxurious guest house providing top-notch facilities and service.",
    images: executeRoomPictures,
  },
];


const PhotoModal = ({ modalOpen, setModalOpen }: any) => {
  const [selectedImages, setSelectedImages] = useState([]);
  const [modalTitle, setModalTitle] = useState("");

  const handleOpenModal = (title: any, images: any) => {
    setSelectedImages(images);
    setModalTitle(title);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedImages([]);
    setModalTitle("");
  };

  useEffect(() => {
    if (modalOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [modalOpen]);

  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === selectedImages.length - 1 ? 0 : prevIndex + 1,
    );
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? selectedImages.length - 1 : prevIndex - 1,
    );
  };
  const featuress = [
    { icon: FaBath, label: "Private bathroom" },
    { icon: FaWifi, label: "Free WiFi" },
    { icon: FaSnowflake, label: "Air conditioning" },
    { icon: FaUsers, label: "Family rooms" },
    { icon: FaConciergeBell, label: "Room service" },
    { icon: FaShower, label: "Shower" },
  ];

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={{
        visible: { opacity: 1, scale: 1 },
        hidden: { opacity: 0, scale: 0 },
      }}
      className=" mx-auto max-w-[1280px]"
    >
      <motion.section
        className="mx-auto w-[80%] rounded-t-lg bg-white py-6 sm:w-full"
        variants={slideInFromLeft(0.5)}
      >
        <div className="flex flex-col items-center justify-center py-5">
          <h3 className="montserrat text-3xl font-bold">Explore Our Hostels</h3>
          <p className="text-2xl font-light">
            Discover top hostels through images. Comfort, amenities, and service
            await you.
          </p>
        </div>

        <div className="grid grid-cols-3 justify-center space-x-4 overflow-x-auto py-5 sm:px-10 px-0">
          {Choices.map((item) => {
            return (
              <div
                key={item.id}
                className="col-span-3 cursor-pointer space-y-1 md:col-span-1"
                onClick={() => handleOpenModal(item.title, item.images)}
              >
                <Image
                  width={500}
                  height={500}
                  key={item.id}
                  className="h-80 w-full rounded-lg object-cover"
                  src={item.src}
                  alt=""
                />
                <p className="font-bold">{item.title}</p>
                {/* <p className="text-sm font-medium text-gray-400 ">{item.description}</p> */}
              </div>
            );
          })}
        </div>
      </motion.section>

      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={handleCloseModal}
        >
          <div
            className="relative flex h-[70vh] w-[90vw] max-w-7xl flex-col items-center justify-start rounded-lg bg-white p-4 sm:h-[80vh] sm:w-[80vw] md:h-[70vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleCloseModal}
              className="absolute right-2 top-2 text-3xl text-gray-400 hover:text-gray-700"
            >
              &times;
            </button>
            <h2 className="mb-4 text-center text-lg font-bold sm:text-2xl">
              {modalTitle}
            </h2>
            <div className="flex w-full flex-col items-center justify-center gap-5 md:grid-cols-4">
              <div className="relative flex flex-col items-center">
                <button
                  className="absolute left-0 top-1/2 z-10 -translate-y-1/2 transform rounded-full bg-white p-2"
                  onClick={handlePrev}
                >
                  <FaArrowLeft />
                </button>

                <Image
                  src={selectedImages[currentIndex] as any}
                  alt="Hostel Image"
                  width={1200}
                  height={1200}
                  className="h-[300px] w-fit rounded-lg object-cover sm:h-[440px]"
                />

                <button
                  className="absolute right-0 top-1/2 z-10 -translate-y-1/2 transform rounded-full bg-white p-2"
                  onClick={handleNext}
                >
                  <FaArrowRight />
                </button>
              </div>
              <div className="z-10">
                <Suspense>
                  <SearchForm aboveClass="flex-col justify-start" belowClass="" />
                </Suspense>
              </div>

              <div className="h-[1px] w-full bg-black"></div>
              <div className="flex w-full flex-wrap items-center justify-center gap-2 px-2">
                {featuress.map((feature: any, index: any) => (
                  <div key={index} className="flex items-center space-x-2 rounded-md border p-2 shadow-sm">
                    <feature.icon className="text-xl" />
                    <span className="w-full">{feature.label}</span>
                  </div>
                ))}
              </div>

              <Link href="/gallery">
                <span className="flex w-auto items-center  text-blue-600 justify-end">
                  View All Photos
                  <FaArrowRight className="ml-2" />
                </span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default PhotoModal;
