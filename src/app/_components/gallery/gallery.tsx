"use client";
import { useEffect } from "react";
import TiltComponent from "../tiltComponent";
import { Button } from "~/components/ui/button";
import Link from "next/dist/client/link";
import StreetView from "~/components/HomePage2/map";
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

export default function Gallery({
  location,
}: {
  location: "executive" | "saran" | "visvesvaraya";
}) {
  useEffect(() => {
    document.getElementById(location)?.scrollIntoView();
  }, []);

  return (
    <div className="flex-col mx-auto my-10 flex max-w-[1280px] flex-wrap gap-10 px-5">
      
      <div>
        <div id="saran" className="text-center text-2xl font-bold">
          Saran
        </div>
        <div className="grid h-full w-full  grid-cols-1 items-center justify-center gap-5 md:grid-cols-4">
          {saranRoomPictures.map((img, index) => {
            return <TiltComponent key={img + index} img={img}></TiltComponent>;
          })}
        </div>
      </div>

      <div>
        <div id="executive" className="text-center text-2xl font-bold">
          Executive
        </div>
        <div className="grid h-full w-full  grid-cols-1 items-center justify-center gap-5 md:grid-cols-4">
          {executeRoomPictures.map((img, index) => {
            return <TiltComponent key={img + index} img={img}></TiltComponent>;
          })}
        </div>
      </div>

      <div>
        <div id="visvesvaraya" className="text-center text-2xl font-bold">
          Visvesvaraya
        </div>
        <div className="grid h-full w-full  grid-cols-1 items-center justify-center gap-5 md:grid-cols-4">
          {viswesawraiyaguesthousePictures.map((img, index) => {
            return <TiltComponent img={img} key={img + index}></TiltComponent>;
          })}
        </div>
      </div>
      <div className="">
      </div>
    </div>
  );
}
