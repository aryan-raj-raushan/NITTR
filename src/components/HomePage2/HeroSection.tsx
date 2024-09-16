import Image from "next/image";
import React, { Suspense, useEffect, useState } from "react";
import SearchForm from "~/app/_components/SearchForm";

const HeroSection = ({ images }: any) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prevImage) => (prevImage + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="mx-auto mb-4 mt-10 max-w-[1280px] sm:p-6">
        <h2 className="montserrat text-center text-xl font-bold text-black sm:text-3xl ">
          Staying Options in NITTTR
        </h2>
      </div>

      <div className="flex w-full flex-col items-center justify-center decoration-gray-900 ">
        <div className="w-full max-w-[1280px] mx-auto sm:px-5 px-0">
          <div className="flex w-full flex-col items-center justify-end lg:flex-row">
            <div className="relative flex w-full flex-col gap-2 rounded-l-xl bg-blue-50 sm:p-8 p-4 pb-12 lg:w-[40%]">
              <h1 className="mb-4 text-lg font-bold sm:text-lg md:text-xl lg:text-2xl xl:text-4xl">
                NITTTR — Comfortable accommodations for visitors
              </h1>
              <p className="mb-8 border-l-2 border-black pl-2 text-gray-600" style={{ textAlign: "justify" }}>
                Our hostel offers clean, secure rooms with modern amenities and Wi-Fi, ideally located on campus for professionals and event attendees.
              </p>
              <div className="z-10">
                <Suspense>
                  <SearchForm aboveClass="flex-col justify-start" belowClass="" setErrorMessage={setErrorMessage} />
                  {errorMessage && (
                    <p className="text-red-500 text-sm">{errorMessage}</p>
                  )}
                </Suspense>
              </div>
            </div>

            <div className="relative hidden h-fit w-full lg:flex lg:w-[60%]">
              <Image
                src={images[currentImage] as any}
                objectFit="cover"
                alt="Hostel room"
                width={1200}
                height={1200}
                className="h-[500px] w-full rounded-3xl object-cover shadow-xl shadow-slate-100"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HeroSection;