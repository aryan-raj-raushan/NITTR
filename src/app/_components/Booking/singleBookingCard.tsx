import { Card } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { TbookingsValidator } from "~/utils/validators/bookingValidators";

export default function SingleBookingsCard({
  booking,
}: {
  booking: TbookingsValidator;
}) {
  return (
    <Card className="flex sm:flex-row flex-col items-start  justify-between sm:px-10 px-5 py-5">
      <div className="col-span-2 flex sm:w-1/2 w-full flex-col  items-start justify-start gap-2">
        <div className="flex items-center gap-6">
          <div className="mb-1 sm:text-2xl text-lg font-bold">Upcoming Booking</div>
          <div className={`w-fit rounded-full px-4 py-1 text-xs font-semibold ${booking.bookingStatus === "UNCONFIRMED" ? "bg-amber-300" : "bg-green-400"}`}>
            {booking.bookingStatus === "UNCONFIRMED"
              ? "PENDING"
              : booking.bookingStatus}
          </div>
        </div>
        <div className="flex items-center justify-center gap-6 text-sm">
          <div className="flex flex-col gap-2">
            <div className="text-xl font-semibold">
              {booking.hostelName.replace(/_/g, " ")}
            </div>
            <div className="flex gap-4 ">
              <div className=" font-medium sm:text-lg text-sm">
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
              <div className="sm:text-base text-sm font-medium">
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
      <div className="flex sm:w-1/2 w-full flex-col gap-2">
        <div className="flex w-full items-center gap-2 font-medium">
          Booking Id -<span className="sm:text-base text-sm font-medium"> {booking.id}</span>
        </div>
        <div className="flex w-full items-center gap-2 font-medium">
          Booked On -
          <span className="sm:text-base text-sm font-medium">
            {new Date(booking.bookingDate).toLocaleString("en-US", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </span>
        </div>

        <div className="flex w-full items-center gap-2 font-medium">
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
