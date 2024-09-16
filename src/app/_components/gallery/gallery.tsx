"use client";
import { useEffect, useState } from "react";

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

export default function Gallery({ location }: { location: "executive" | "saran" | "visvesvaraya"; }) {
  const [isOpen, setIsOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [activeImages, setActiveImages] = useState<string[]>([]);

  const openLightbox = (images: string[], index: number, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setActiveImages(images);
    setPhotoIndex(index);
    setIsOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setIsOpen(false);
    document.body.style.overflow = 'auto';
  };

  const nextImage = () => {
    setPhotoIndex((photoIndex + 1) % activeImages.length);
  };

  const prevImage = () => {
    setPhotoIndex((photoIndex + activeImages.length - 1) % activeImages.length);
  };

  useEffect(() => {
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <div className="flex-col mx-auto my-10 flex max-w-[1280px] flex-wrap gap-10 px-5">
      <div>
        <div id="saran" className="text-center text-2xl font-bold">Saran</div>
        <div className="grid h-full w-full grid-cols-1 items-center justify-center gap-5 md:grid-cols-4">
          {saranRoomPictures.map((img, index) => (
            <div key={img + index} onClick={(event) => openLightbox(saranRoomPictures, index, event)}>
              <img src={img} alt={`Saran Room ${index + 1}`} className="cursor-pointer w-full h-auto" />
            </div>
          ))}
        </div>
      </div>

      <div>
        <div id="executive" className="text-center text-2xl font-bold">Executive</div>
        <div className="grid h-full w-full grid-cols-1 items-center justify-center gap-5 md:grid-cols-4">
          {executeRoomPictures.map((img, index) => (
            <div key={img + index} onClick={(event) => openLightbox(executeRoomPictures, index, event)}>
              <img src={img} alt={`Executive Room ${index + 1}`} className="cursor-pointer w-full h-auto" />
            </div>
          ))}
        </div>
      </div>

      <div>
        <div id="visvesvaraya" className="text-center text-2xl font-bold">Visvesvaraya</div>
        <div className="grid h-full w-full grid-cols-1 items-center justify-center gap-5 md:grid-cols-4">
          {viswesawraiyaguesthousePictures.map((img, index) => (
            <div key={img + index} onClick={(event) => openLightbox(viswesawraiyaguesthousePictures, index, event)}>
              <img src={img} alt={`Visvesvaraya Room ${index + 1}`} className="cursor-pointer w-full h-auto" />
            </div>
          ))}
        </div>
      </div>

      {/* Custom Lightbox Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80" onClick={closeLightbox}>
          <button className="absolute top-5 right-5 text-white text-3xl" onClick={closeLightbox}>
            ✕
          </button>
          <button className="absolute left-5 text-white text-7xl" onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}>
            ‹
          </button>
          <img src={activeImages[photoIndex]} className="max-h-full max-w-full object-contain" alt="Gallery" />
          <button className="absolute right-5 text-white text-7xl" onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}>
            ›
          </button>
          <div className="absolute bottom-5 text-white text-xl">
            {photoIndex + 1} / {activeImages.length}
          </div>
        </div>
      )}
    </div>
  );
}
