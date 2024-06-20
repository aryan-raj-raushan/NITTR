import Image from "next/image";
import React, { Suspense, useEffect, useState } from "react";
import SearchForm from "~/app/_components/SearchForm";
import { Quote } from "../Assets";
import { motion } from "framer-motion";
import { slideInFromBottom, slideInFromLeft } from "~/utils/motion";

const HeroSection = ({ images }: any) => {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prevImage) => (prevImage + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);
  return (
    <>
      <motion.div className="mx-auto mb-4 mt-10 max-w-[1280px] sm:p-6">
        <h2 className="montserrat text-center text-xl font-bold text-black sm:text-3xl ">
          Staying Options in NITTTR
        </h2>
      </motion.div>

      <motion.div
        className="flex w-full flex-col items-center  justify-center decoration-gray-900"
        variants={slideInFromBottom(0.1)}
      >
        <div className=" ">
          <div className="flex w-fit flex-col items-center justify-end md:flex-row">
            <div className="relative flex w-[80%] flex-col gap-2 rounded-l-xl bg-blue-50 p-8 pb-12 sm:w-[40%]">
              <h1 className="mb-4 text-4xl font-bold ">
                NITTTR — Comfortable accommodations for visitors
              </h1>
              <p className="mb-8 border-l-2 border-black pl-2 text-gray-600">
                Our hostel offers clean, secure, and comfortable rooms for short
                or extended stays. Enjoy modern amenities, Wi-Fi, and a
                convenient location on campus. Ideal for professionals and
                guests attending training and events.
              </p>
              <div className="z-10 ml-0 sm:ml-10">
                <Suspense>
                  <SearchForm />
                </Suspense>
              </div>
            </div>

            <div className="relative hidden h-fit w-1/2 sm:flex">
              <Image
                src={images[currentImage] || "/default.jpg"}
                objectFit="cover"
                alt="Hostel room"
                width={1200}
                height={1200}
                className="h-[500px] w-[1200px] rounded-l-3xl object-cover shadow-xl shadow-slate-100"
              />
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default HeroSection;
