import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaGooglePlusG } from 'react-icons/fa';
import { RiContactsBook2Fill } from "react-icons/ri";
import { IoMdMail } from "react-icons/io";
import { BiSolidPhoneCall } from "react-icons/bi";
import { PiFinnTheHumanFill } from "react-icons/pi";
import "../../styles/globals.css";
import Link from 'next/link';

const MapSection = () => {
  return (
    <div className="mx-auto flex w-[95%] max-w-[1280px] flex-col py-12 sm:w-[90%] bg-gray-200 rounded-xl">
      <div className="mb-8 flex flex-col items-center justify-center text-center">
        <h2 className="montserrat flex w-full items-center justify-center text-3xl font-bold text-bg-primaryBackground ">
          We're Here For You
          <br /> Every Day
        </h2>
        <p className=" poppins-medium text-xl font-medium uppercase">
          Our online support service is available daily
        </p>
      </div>
      <div className="flex w-full flex-col items-start justify-center gap-x-4 sm:flex-row">
        <div className="mb-8 flex sm:w-1/2 w-full items-center justify-center px-4">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3666.118440497404!2d77.39142980000001!3d23.238776700000003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x397c42bac1af5c0b%3A0xa5aa6a3443eeba1b!2sSaran%20Guest%20House%2C%20Science%20Center%20Rd%2C%20NITTTR%20Campus%2C%20Shymala%20Hills%2C%20Bhopal%2C%20Madhya%20Pradesh%20462002!5e0!3m2!1sen!2sin!4v1718854769937!5m2!1sen!2sin"
            width="100%"
            height="320"
            className="rounded-lg"
            loading="lazy"
          ></iframe>
        </div>
        <div className="flex sm:pl-0 pl-4  flex-col">
          <div className="mb-4">
            <div className="flex items-center gap-1">
              <RiContactsBook2Fill className="text-3xl" />
              <h3 className="text-2xl font-bold">Address</h3>
            </div>
            <p>
              Shamla Hills, Bhopal - 462 002 (M.P.) , India
            </p>
          </div>
          <div className="mb-4">
            <div className="flex items-center gap-1">
              <IoMdMail className="text-3xl" />
              <h3 className="text-2xl font-bold">Mail</h3>
            </div>
            <p>
      Email : director@nitttrbpl.ac.in <br/>
      Web{" "}: {" "}
      <a href="https://www.nitttrbpl.ac.in/" target="_blank" rel="noopener noreferrer">www.nitttrbpl.ac.in</a>
    </p>
          </div>
          <div className="mb-4">
            <div className="flex items-center gap-1">
              <BiSolidPhoneCall className="text-3xl" />
              <h3 className="text-2xl font-bold">Call</h3>
            </div>
            <p>Telephone : 91(0755)2661600-602 <br/>
            Telephone : 607-608</p>
          </div>
          {/* <div>
                        <div className='flex  gap-1 items-start w-full'>
                            <PiFinnTheHumanFill className='text-3xl' />
                            <h3 className="text-2xl font-bold w-full">Social account</h3>
                        </div>
                        <div className="flex space-x-4 mt-2">
                            <button className="text-gray-500 hover:text-gray-700">
                                <FaFacebookF className='text-3xl' />
                            </button>
                            <button className="text-gray-500 hover:text-gray-700">
                                <FaTwitter className='text-3xl' />
                            </button>
                            <button className="text-gray-500 hover:text-gray-700">
                                <FaInstagram className='text-3xl' />
                            </button>
                            <button className="text-gray-500 hover:text-gray-700">
                                <FaGooglePlusG className='text-3xl' />
                            </button>
                        </div>
                    </div> */}
        </div>
      </div>
    </div>
  );
};

export default MapSection;
