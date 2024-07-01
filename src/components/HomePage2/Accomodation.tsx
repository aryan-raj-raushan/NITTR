"use client"
import Image from 'next/image';
import { BsBuildings } from "react-icons/bs";
import { RiHandHeartFill } from "react-icons/ri";
import { FaBedPulse } from "react-icons/fa6";
import { useEffect, useState } from 'react';
import SearchForm from '~/app/_components/SearchForm';
import { motion } from "framer-motion";

const Accomodation = ({ showModal, setShowModal }: any) => {

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  useEffect(() => {

    if (showModal) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }

    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [showModal]);



  return (
    <motion.div

      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={{
        visible: { opacity: 1, scale: 1 },
        hidden: { opacity: 0, scale: 0 },
      }}
      className=' max-w-[1280px] mx-auto'
    >
      <div className="flex flex-col lg:flex-row items-center justify-evenly bg-gray-100 sm:p-8 p-2 sm:mx-0 mx-2 rounded-lg sm:w-full w-[90%]">
        <div className="lg:w-1/2 mb-8 lg:mb-0">
          <h2 className="sm:text-5xl text-xl font-bold mb-4">Find suitable budget accommodation</h2>
          <p className="text-gray-600 mb-6">
            Condimentum id venenatis a condimentum vitae sapien pellentesque habitant. At augue eget arcu dictum varius
            duis at consectetur.
          </p>
          <div className="space-y-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-600 text-white flex items-center justify-center rounded-md">
                <BsBuildings />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold">Hostel territory</h3>
                <p className="text-gray-600">Consequat interdum varius sit amet mattis</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-600 text-white flex items-center justify-center rounded-md">
                <RiHandHeartFill />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold">Accommodates guests</h3>
                <p className="text-gray-600">Consequat interdum varius sit amet mattis</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-600 text-white flex items-center justify-center rounded-md">
                <FaBedPulse />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold">Grateful guests</h3>
                <p className="text-gray-600">Consequat interdum varius sit amet mattis</p>
              </div>
            </div>
          </div>
        </div>
        <div className=" flex flex-col items-center lg:items-start relative">
          <div className="bg-white p-4 rounded-lg shadow-lg mb-6">
            <Image
              src="https://images.pexels.com/photos/1957477/pexels-photo-1957477.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
              alt="Room Image"
              width={400}
              height={400}
              className="rounded-lg  object-cover"
            />
          </div>
          <motion.div className="bg-white absolute bottom-0 left-0 translate-x-[-50%] translate-y-[-50%] shadow-xl shadow-gray-500 p-4 rounded-lg sm:flex flex-col hidden"

          >
            <p className="text-lg font-semibold">This is the perfect hostel for a weekend getaway!</p>
            <div className="flex items-center mt-2">
              <Image
                src="https://images.pexels.com/photos/3992656/pexels-photo-3992656.png?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                alt="Esmond Ward"
                width={40}
                height={40}
                className="rounded-full w-10 h-10 object-cover"
              />
              <div className="ml-4">
                <h4 className="font-semibold">Esmond Ward</h4>
              </div>
            </div>
          </motion.div>
          <div className="absolute bottom-1/2 md:right-10 right-0 lg:-translate-x-[-50%] bg-white shadow-xl shadow-gray-500 p-4 rounded-lg">
            <div className='flex-col lg:hidden md:flex xl:flex hidden'>
              <h3 className="text-xl font-semibold">Family Room with Private Bathroom</h3>
              <p className="text-2xl font-bold text-blue-600">
                Rs 500 <span className="text-lg font-normal">/ per night</span>
              </p>
            </div>
            <button className="mt-2 bg-blue-600 text-white py-2 px-4 rounded-md" onClick={openModal}>
              See availability
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 w-screen h-screen"
          onClick={closeModal}
        >
          <div
            className="relative bg-white rounded-lg p-4 max-w-5xl w-full sm:h-72 h-fit mx-10 items-center justify-start flex flex-col gap-20"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className='text-2xl font-bold'>Fill up this form to see availability</h2>
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-3xl"
            >
              &times;
            </button>
            <div className='pt-1'>
              <SearchForm aboveClass="justify-center" belowClass="w-fit" />
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Accomodation;