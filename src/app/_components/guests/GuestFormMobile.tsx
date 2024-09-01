import { useForm } from "react-hook-form";
import { useToast } from "~/components/ui/use-toast";
import { api } from "~/trpc/react";
import { Gender, MaritalStatus } from "@prisma/client";
import { removeUnderscore } from "~/lib/utils";

function GuestFormMobile({ roomCharges }: any) {
  const { toast } = useToast();
  const form = useForm({
    mode: "onChange",
  });

  const createGuestMutation = api.guests.createGuest.useMutation({
    onSuccess: async ({ guest }: any) => {
      window.location.reload();
    },
  });

  function onSubmit(data: any) {
    createGuestMutation.mutate(data);
    toast({
      title: "You submitted the Guest Details:",
    });
  }

  const filteredRoomCharges = Object.fromEntries(
    Object.entries(roomCharges).filter(
      ([key, value]) => value !== null && key !== "hostelName" && key !== "id"
    )
  );

  const {
    handleSubmit,
    formState: { errors },
    control,
    watch,
  } = form;

  const hasGST = watch("hasGST");

  return (
    <div className="fixed inset-0 flex items-end justify-center bg-black bg-opacity-50 z-50">
      <div className="w-full h-4/5 bg-white rounded-t-lg overflow-y-auto animate-slide-up p-6">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="bookingFor">
              Who are you booking for?
            </label>
            <select
              id="bookingFor"
              {...control.register("bookingFor", { required: true })}
              className="block w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="">Select booking type</option>
              <option value="self">For myself</option>
              <option value="someone_else">For someone else</option>
            </select>
            {errors.bookingFor && (
              <p className="mt-2 text-red-500">This field is required</p>
            )}
          </div>

          {/* Add other form fields here following the same pattern */}

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Add Guest
          </button>
        </form>
      </div>
    </div>
  );
}

export default GuestFormMobile;
