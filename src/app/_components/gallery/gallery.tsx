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
  location: "executive" | "saran" | "vishveshvaraya";
}) {
  useEffect(() => {
    document.getElementById(location)?.scrollIntoView();
  }, []);

  return (
    <div className="flex-gol flex flex-wrap gap-10 my-10 max-w-[1280px] mx-auto">
      <div className="flex w-full items-center  justify-center">
        <Link
          className="rounded bg-primary p-3 text-white"
          target="_blank"
          href={
            "https://www.google.com/maps/place/NITTTR+Campus,+Shymala+Hills,+Bhopal,+Madhya+Pradesh/@23.2380394,77.3907465,3a,75y,14.12h,90.91t/data=!3m8!1e1!3m6!1sAF1QipP_w9L6tJOB6U8sdt36WlDMIE1n27epx8fuA1uF!2e10!3e11!6shttps:%2F%2Flh5.googleusercontent.com%2Fp%2FAF1QipP_w9L6tJOB6U8sdt36WlDMIE1n27epx8fuA1uF%3Dw203-h100-k-no-pi-0-ya19.877407-ro-0-fo100!7i10000!8i5000!4m7!3m6!1s0x397c42bacfb84ebd:0x37fd70b0441d4294!8m2!3d23.2396635!4d77.3916541!10e5!16s%2Fg%2F1jkycrvh_?entry=ttu"
          }
        >
          View in 360°
        </Link>
      </div>
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
        <div id="vishveshvaraya" className="text-center text-2xl font-bold">
          Vishveshvaraya
        </div>
        <div className="grid h-full w-full  grid-cols-1 items-center justify-center gap-5 md:grid-cols-4">
          {viswesawraiyaguesthousePictures.map((img, index) => {
            return <TiltComponent img={img} key={img + index}></TiltComponent>;
          })}
        </div>
      </div>
      <div className="">
      <StreetView />
    </div>
    </div>
  );
}
