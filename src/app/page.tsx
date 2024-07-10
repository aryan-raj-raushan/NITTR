"use client";
// import Accomodation from "~/components/HomePage2/Accomodation";
import VipCard from "./_components/VipCard/VipCard";
import HeroSection from "~/components/HomePage2/HeroSection";
import MapSection from "~/components/HomePage2/MapSection";
import PhotoModal from "~/components/HomePage2/PhotoModal";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
// import StreetView from "~/components/HomePage2/map";
import { slideInFromBottom } from "~/utils/motion";

import {useAnimation } from "framer-motion";
import { useEffect } from "react";

export default function Home() {
  // const [showModal, setShowModal] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const controls = useAnimation();

  useEffect(() => {
    controls.start("visible");
  }, [controls]);

  return (
    <main className="flex flex-col justify-center items-center py-14">
      <AnimatePresence>
        <motion.div
          key="content"
          initial="hidden"
          animate={controls}
          variants={containerAnimation}
          exit="hidden"
        >
          <motion.div variants={slideInFromBottom(0.1)} className="flex flex-col gap-2 justify-center items-center text-center max-w-[1280px] mx-auto">
            <div className="font-bold text-primary text-xl md:text-4xl">NATIONAL INSTITUTE OF</div>
          </motion.div>

          <motion.div variants={slideInFromBottom(0.6)} className="flex flex-col gap-2 justify-center items-center text-center max-w-[1280px] mx-auto">
            <div className="font-bold text-primary text-lg sm:text-3xl md:text-4xl"> TECHNICAL TEACHERS TRAINING AND RESEARCH, BHOPAL</div>
          </motion.div>

          <motion.div variants={itemAnimation} className="flex flex-col gap-2 justify-center items-center text-center max-w-[1280px] mx-auto mt-4">
            <div className="text-sm sm:text-base md:text-xl w-fit px-10">Established in 1965 by the Ministry of Education, Government of India, NITTTR, Bhopal stands as a distinguished Deemed University training teachers and enhancing the overall quality of the Technical Education System. Our commitment extends to the continual improvement of educational standards.</div>
          </motion.div>

          <HeroSection images={Choices.map((choice) => choice.src)} />
          <VipCard />
          <PhotoModal modalOpen={modalOpen} setModalOpen={setModalOpen} />
          {/* <Accomodation showModal={showModal} setShowModal={setShowModal}/> */}
          <MapSection />
        </motion.div>
      </AnimatePresence>
    </main>
  );
}
const Choices = [
  {
    id: 1,
    src: "https://aakash2330-drippy.s3.amazonaws.com/NITTTR/saran/fwdsaranguesthouselatestphotograph/_DSC0346+(2).JPG",
    title: "Saran Guest House",
    location: "saran",
    description: "",
  },
  {
    id: 2,
    src: "https://aakash2330-drippy.s3.amazonaws.com/NITTTR/fwdviswesawraiyaguesthouse/_DSC0140.JPG",
    title: "Visvesvaraya Guest House",
    location: "visvesvaraya",
    description: "",
  },
  {
    id: 3,
    src: "https://aakash2330-drippy.s3.amazonaws.com/NITTTR/fwdexecutivehostelphotograph/DSC_1095.JPG",
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
