import ProductHeroSlider from "~/app/_components/single-hostel";
import { TbookingType } from "~/lib/utils";
import { api } from "~/trpc/server";

export default async function Page({
  params,
  searchParams,
}: {
  params: { hostelId: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {


  const { roomDetails } = await api.room.getRoomById.mutate({
    hostelId: params.hostelId,
  });

  if (roomDetails) {
    return (
      <ProductHeroSlider
        bookingType={searchParams?.type as TbookingType}
        checkin={new Date(searchParams?.checkin as string)}
        checkout={new Date(searchParams?.checkout as string)}
        roomDetails={roomDetails}
      ></ProductHeroSlider>
    );
  } else {
    return <div>INVALID ROOM ID</div>;
  }
}
