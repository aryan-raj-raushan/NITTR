import { Card } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import Backpack from "public/backpack-icon-flat-style-vector-20186178.jpg"
import Image from "next/image";
import Link from "next/link";

export default function NoBookingsCard() {
  return <Card className="p-10 grid grid-cols-4 justify-center items-center">
    <div className="flex justify-center items-center"></div>
    <div className="col-span-2 space-y-2">
      <div className="font-extrabold">Looks Empty , You've no Bookings</div>
      <div className="text-sm text-gray-500">Would you like to make a booking ?</div>
      <Button><Link href='/'>Make a Booking</Link></Button>
    </div>
  </Card>
}
