import Image from "next/image";
import React from "react";
import { FaLocationDot } from "react-icons/fa6";
import { FaPhone } from "react-icons/fa6";
import logo from "public/nitttrLogo.jpg";
const Footer = () => {
  return (
    <footer className="w-full bg-primaryBackground py-10 text-white ">
      <div className="mx-auto flex max-w-[1280px] px-10">
        <div className="flex w-1/3 flex-col items-start justify-start">
          <div className="flex items-start gap-4">
            <Image
              src={logo}
              alt={"NITTTR"}
              width={500}
              height={500}
              className="mt-2 h-10 w-10"
            />
            <div className="flex flex-col">
              <h2 className="text-xl font-bold">NITTTR</h2>
              <p className="text-sm">
                Experience comfort and freedom in our vibrant hostel. Whether
                you're traveling solo or in a group, our welcoming environment
                ensures a memorable stay.
              </p>
            </div>
          </div>
        </div>
        <div className="flex w-1/3 flex-col items-center justify-center">
          <h2 className="text-xl font-bold">Quick links</h2>
          <ul className="mt-4 flex flex-col gap-2 ">
            <li>
              <a href="#" className="hover:underline">
                Home
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                About
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Rooms
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                News
              </a>
            </li>
          </ul>
        </div>
        <div className="flex w-1/3 flex-col items-center justify-center">
          <h2 className="text-xl font-bold">Contact Us</h2>
          <ul className="mt-4 flex flex-col gap-3">
            <div className="flex items-start gap-x-2">
              <FaLocationDot className="mt-1" />
              <span className="">
                54826 Fadel Circles <br />
                Darrylstad, AZ 90995
              </span>
            </div>
            <div className="flex items-start gap-2">
              <FaPhone className="mt-1" />
              <span>
                (329) 580-7077
                <br />
                (650) 382-5020
              </span>
            </div>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
