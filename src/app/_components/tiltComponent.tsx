
'use client';
import Image from 'next/image';
import Link from 'next/link';
import Tilt from 'react-parallax-tilt';
export default function TiltComponent({ img }: { img: any }) {

  return <div className="">
    <Link href={"/"}>
      <Tilt>
        <div
          key={1}
          className="group relative flex flex-col overflow-hidden rounded-lg border border-white bg-white"
        >
          <div
            className={`${true
              ? 'aspect-h-3 aspect-w-4 '
              : 'aspect-h-4 aspect-w-3'
              } sm:aspect-none sm:h-100`}
          >

            <Image
              src={img}
              alt={img}
              width={500}
              height={500}
              className="h-full w-full object-cover object-center sm:h-full sm:w-full"
            />
          </div>
         
        </div>
      </Tilt>
    </Link>

  </div>
}
