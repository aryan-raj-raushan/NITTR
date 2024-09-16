import { Card } from "~/components/ui/card";
import Image from "next/image";
import img1 from "public/Official_Photograph_of_Prime_Minister_Narendra_Modi_Portrait (1).png"
import img2 from "public/Dharmendra-Pradhan.webp"
import img3 from "public/newdir1.jpg"
const vipData = [{
  img: img1,
  title: "Shri Narendra Modi",
  description: "Prime Minister of India"
}, {
  img: img2,
  title: "Shri Dharmendra Pradhan",
  description: " Minister of Education"
}, {
  img: img3,
  title: "Prof. Chandra Charu Tripathi",
  description: "Director, NITTTR"
}]

export default function VipCard() {
  return <Card className="flex sm:flex-row flex-col items-center gap-2 sm:w-[95%] w-[70%] p-7  max-w-[1280px] mx-auto mt-10 bg-gray-400">
    <div className="w-full text-sm col-span-3 md:col-span-1 flex flex-col justify-center items-center basis-1/2">
      <div className="text-primary font-bold text-2xl">ABOUT NITTTR</div>
      <p className="text-gray-700 font-medium text-justify" style={{ textAlign: "justify" }}>
        National Institute of Technical Teachers' Training and Research, Bhopal is a unique premier institution, established in 1965 by Ministry of Education, Government of India for teacher training
      </p>
    </div>

    <div className="flex sm:flex-row flex-col  w-full gap-2 sm:gap-10 col-span-3 md:col-span-2 justify-center items-center">
      {vipData.map((data, index) => {
        return <div key={data.title + index} className="flex flex-col justify-center items-center size-50 ">

          <Image
            className={`w-20 h-20 object-cover rounded-full`}
            src={data.img}
            alt={data.title}
          />
          <div className="text-center">{data.title}</div>
          <div className="text-center text-xs">{data.description}</div>
        </div>
      })}
    </div>
  </Card>
}
