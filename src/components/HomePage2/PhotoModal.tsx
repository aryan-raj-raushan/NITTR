import Link from "next/link";
import React, { useState, useEffect } from "react";
import { FaArrowRight } from "react-icons/fa";
import { motion } from "framer-motion";
import { slideInFromLeft } from "~/utils/motion";
import { FaArrowLeft } from "react-icons/fa6";
import Image from "next/image";

const saranRoomPictures = [
  "https://aakash2330-drippy.s3.amazonaws.com/NITTTR/saran/fwdsaranguesthouselatestphotograph/_DSC0346+(2).JPG",
  "https://aakash2330-drippy.s3.amazonaws.com/NITTTR/saran/fwdsaranguesthouselatestphotograph/DSC_0127.JPG",
  "https://aakash2330-drippy.s3.amazonaws.com/NITTTR/saran/fwdsaranguesthouselatestphotograph/DSC_0136.JPG",
  "https://aakash2330-drippy.s3.amazonaws.com/NITTTR/saran/fwdsaranguesthouselatestphotograph/DSC_0137.JPG",
  "https://aakash2330-drippy.s3.amazonaws.com/NITTTR/saran/fwdsaranguesthouselatestphotograph/DSC_0140.JPG",
];

const executeRoomPictures = [
  "https://aakash2330-drippy.s3.amazonaws.com/NITTTR/fwdexecutivehostelphotograph/DSC_1095.JPG",
  "https://aakash2330-drippy.s3.amazonaws.com/NITTTR/fwdexecutivehostelphotograph/DSC_1107.JPG",
  "https://aakash2330-drippy.s3.amazonaws.com/NITTTR/fwdexecutivehostelphotograph/DSC_1115.JPG",
  "https://aakash2330-drippy.s3.amazonaws.com/NITTTR/fwdexecutivehostelphotograph/DSC_1120.JPG",
];

const viswesawraiyaguesthousePictures = [
  "https://aakash2330-drippy.s3.amazonaws.com/NITTTR/fwdviswesawraiyaguesthouse/DSC_0067.JPG",
  "https://aakash2330-drippy.s3.amazonaws.com/NITTTR/fwdviswesawraiyaguesthouse/DSC_0067.JPG",
  "https://aakash2330-drippy.s3.amazonaws.com/NITTTR/fwdviswesawraiyaguesthouse/DSC_0111.JPG",
  "https://aakash2330-drippy.s3.amazonaws.com/NITTTR/fwdviswesawraiyaguesthouse/DSC_1422.JPG",
];

const Choices = [
  {
    id: 1,
    src: "https://aakash2330-drippy.s3.amazonaws.com/NITTTR/saran/fwdsaranguesthouselatestphotograph/_DSC0346+(2).JPG",
    title: "Saran Guest House",
    description:
      "A cozy and well-equipped guest house offering a comfortable stay.",
    images: saranRoomPictures,
  },
  {
    id: 2,
    src: "https://aakash2330-drippy.s3.amazonaws.com/NITTTR/fwdviswesawraiyaguesthouse/_DSC0140.JPG",
    title: "Visvesvaraya Guest House",
    description:
      "Elegant guest house with modern amenities for a pleasant experience.",
    images: viswesawraiyaguesthousePictures,
  },
  {
    id: 3,
    src: "https://aakash2330-drippy.s3.amazonaws.com/NITTTR/fwdexecutivehostelphotograph/DSC_1095.JPG",
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
                <p className="text-sm font-medium text-gray-400 ">{item.description}</p>
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
            className="relative flex w-fit max-w-xs flex-col items-center justify-start rounded-lg bg-white p-4 px-8  py-5 sm:max-w-7xl sm:pb-10 sm:pt-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleCloseModal}
              className="absolute right-2 top-2 text-3xl text-gray-400 hover:text-gray-700"
            >
              &times;
            </button>
            <h2 className="mb-4 text-center text-2xl font-bold">
              {modalTitle}
            </h2>
            {/* <div className="grid h-full w-full grid-cols-1 items-center justify-center gap-5 md:grid-cols-4">
              {selectedImages.slice(0, 8).map((img, index) => (
                <TiltComponent key={img + index} img={img} />
              ))}
              <Link href="/gallery">
                <span className="w-full flex justify-center items-center absolute bottom-5 left-[45%]">
                  <FaArrowRight />
                  View All</span>
              </Link>
            </div> */}
            <div className="flex h-full w-full flex-col  items-center justify-center gap-5 md:grid-cols-4">
              <div className="relative mx-10 flex flex-col items-center">
                <button
                  className="absolute left-0 top-1/2 z-10 -translate-y-1/2 transform rounded-full bg-white p-2"
                  onClick={handlePrev}
                >
                  <FaArrowLeft />
                </button>

                <Image
                  src={selectedImages[currentIndex] || "/default.jpg"}
                  alt="Hostel Image"
                  width={700}
                  height={700}
                  className="h-[440px] w-full rounded-lg object-cover"
                />

                <button
                  className="absolute right-0 top-1/2 z-10 -translate-y-1/2 transform rounded-full bg-white p-2"
                  onClick={handleNext}
                >
                  <FaArrowRight />
                </button>
              </div>

              <div className="mt-5 flex max-w-xs justify-start space-x-3 sm:max-w-7xl">
                {selectedImages.map((img, index) => (
                  <div
                    key={img + index}
                    className={`h-24 w-24 border ${
                      index === currentIndex
                        ? "rounded border-2 border-gray-500"
                        : "border-gray-300"
                    }`}
                    onClick={() => setCurrentIndex(index)}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${index}`}
                      className="h-full w-full object-cover "
                    />
                  </div>
                ))}
              </div>

              <Link href="/gallery">
                <span className="absolute bottom-4 right-10 flex w-fit items-center justify-center text-blue-600">
                  View All
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
