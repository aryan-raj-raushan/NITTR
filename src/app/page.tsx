"use client";
// import Accomodation from "~/components/HomePage2/Accomodation";
import VipCard from "./_components/VipCard/VipCard";
import HeroSection from "~/components/HomePage2/HeroSection";
import MapSection from "~/components/HomePage2/MapSection";
import PhotoModal from "~/components/HomePage2/PhotoModal";
import { useState } from "react";
import { useAnimation } from "framer-motion";
import { useEffect } from "react";

import HeroBannerOne from "../../public/hero_banner_1.webp"
import HeroBannerTwo from "../../public/hero_banner_2.webp"
import HeroBannerThree from "../../public/hero_banner_3.webp"

export default function Home() {
  // const [showModal, setShowModal] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const controls = useAnimation();

  useEffect(() => {
    controls.start("visible");
  }, [controls]);

  return (
    <main className="flex flex-col justify-center items-center py-14">
      <>
        <div

        >
          <div className="flex flex-col gap-2 justify-center items-center text-center max-w-[1280px] mx-auto">
            <div className="font-bold text-primary text-xl md:text-4xl">NATIONAL INSTITUTE OF</div>
          </div>

          <div className="flex flex-col gap-2 justify-center items-center text-center max-w-[1280px] mx-auto">
            <div className="font-bold text-primary text-lg sm:text-3xl md:text-4xl"> TECHNICAL TEACHERS TRAINING AND RESEARCH, BHOPAL</div>
          </div>

          <div className="flex flex-col gap-2 justify-center items-center text-center max-w-[1280px] mx-auto mt-4">
            <div className="text-sm sm:text-base md:text-xl w-fit px-10">Enjoy a cozy and welcoming environment with modern amenities, spacious rooms, free Wi-Fi, and 24/7 security for a memorable stay.</div>
          </div>

          <HeroSection images={Choices.map((choice) => choice.src)} />
          <VipCard />
          <PhotoModal modalOpen={modalOpen} setModalOpen={setModalOpen} />
          {/* <Accomodation showModal={showModal} setShowModal={setShowModal}/> */}
          <MapSection />
        </div>
      </>
    </main>
  );
}
const Choices = [
  {
    id: 1,
    src: HeroBannerOne,
    title: "Saran Guest House",
    location: "saran",
    description: "",
  },
  {
    id: 2,
    src: HeroBannerTwo,
    title: "Vishveshvaraya Guest House",
    location: "vishveshvaraya",
    description: "",
  },
  {
    id: 3,
    src: HeroBannerThree,
    title: "Executive Guest House",
    location: "executive",
    description: "",
  },
];

// Animation variants
const containerAnimation = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.5 } },
};

const itemAnimation = {
  hidden: { y: -50, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 600, damping: 10 } },
};
