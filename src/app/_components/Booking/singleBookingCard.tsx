
import { Card } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { TbookingsValidator } from "~/utils/validators/bookingValidators";

export default function SingleBookingsCard({ booking }: { booking: TbookingsValidator }) {
  console.log(booking,"booking ")
  return (
    <Card className="flex items-start  justify-between px-10 py-5">
      <div className="col-span-2 flex w-1/2 flex-col  items-start justify-start gap-2">
        <div className="flex items-center gap-6">
          <div className="mb-1 text-2xl font-bold">Upcoming Booking</div>
          <div className="w-fit rounded-full bg-green-400 px-4 py-1 text-xs font-semibold">
            {booking.bookingStatus}
          </div>
        </div>
        <div className="flex items-center justify-center gap-6 text-sm">
          <div className="flex flex-col gap-2">
            <div className="text-xl font-semibold">
              {booking.hostelName.replace(/_/g, " ")}
            </div>
            <div className="flex gap-4">
              <div className="text-lg font-medium">
                {new Date(booking.bookedFromDt.toString()).toLocaleString(
                  "en-US",
                  {
                    weekday: "short",
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  },
                )}
              </div>

              <div>
                <Separator orientation="vertical" className="h-10"></Separator>
              </div>
              <div className="text-lg font-medium">
                {new Date(booking.bookedToDt.toString()).toLocaleString(
                  "en-US",
                  {
                    weekday: "short",
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  },
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex w-1/2 flex-col gap-2">
        <div className="flex w-full items-center gap-2 font-medium">
          Booking Id -<span className="text-lg font-medium"> {booking.id}</span>
        </div>
        <div className="flex w-full items-center gap-2 font-medium">
          Booked On -
          <span className="text-lg font-medium">
            {new Date(booking.bookingDate).toLocaleString("en-US", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </span>
        </div>

        <div className="flex w-full gap-2 items-center font-medium">
          Guests -
          <span className="text-lg font-medium ">
            {" "}
            {booking.guestsList.length}{" "}
          </span>{" "}
        </div>
      </div>
    </Card>
  );
}
