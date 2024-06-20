import { api } from "~/trpc/server";
import Checkout from "../_components/Checkout/Checkout";
import { TbookingType } from "~/lib/utils";

export default async function Page({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const { roomDetails, roomCharges } = await api.room.getRoomById.mutate({ hostelId: searchParams?.id as string })
  if (roomDetails && roomCharges) {
    return <Checkout
      bookingType={searchParams?.type as TbookingType} 
      checkin={new Date(searchParams?.checkin as string)} 
      checkout={new Date(searchParams?.checkout as string)}  
      roomCharges={roomCharges} roomDetails={roomDetails}>
    </Checkout>
  }
  else {
    return <div>INVALID ROOM ID</div>
  }
}
