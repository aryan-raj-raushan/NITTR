import * as React from "react"
import Autoplay from "embla-carousel-autoplay"
import Image from "next/image";
import { Card, CardContent } from "~/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "~/components/ui/carousel"
import img1 from "../../../../public/1.jpg"
import img2 from "../../../../public/2.jpg"
import img3 from "../../../../public/3 Chandrakant Hostel.jpeg"
import img4 from "../../../../public/siemens_center_of_excellence_nitttr_bhopal_cover.jpeg"

export function CarouselPlugin() {
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  )

  return (
    <Carousel
      plugins={[plugin.current]}
      className="w-full h-[35rem]"
    >
      <CarouselContent>
        {[img1, img2, img3, img4].map((img, index) => (
          <CarouselItem key={index}>
            <div className="p-1">
              <Card>
                <CardContent className="flex items-center justify-center p-6">
                  <Image
                    key={index}
                    className="w-full h-[35rem] object-cover rounded-lg pb-2"
                    src={img}
                    alt=""
                  />
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}
