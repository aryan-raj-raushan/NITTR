import { useForm } from "react-hook-form";
import { useToast } from "~/components/ui/use-toast";
import { api } from "~/trpc/react";
import { Gender, MaritalStatus } from "@prisma/client";
import { removeUnderscore } from "~/lib/utils";

function GuestForm({ roomCharges }: any) {
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
    <div className="flex h-full w-full justify-center overflow-y-auto">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full space-y-6 bg-white p-6 rounded-t-lg lg:rounded-lg"
      >
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Who are you booking for?
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="self"
                {...control.register("bookingFor", { required: true })}
                className="hidden peer"
              />
              <div className="px-4 py-2 text-gray-700 rounded-full border border-gray-300 peer-checked:bg-blue-500 peer-checked:text-white peer-checked:border-blue-500 cursor-pointer">
                For myself
              </div>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="someone_else"
                {...control.register("bookingFor", { required: true })}
                className="hidden peer"
              />
              <div className="px-4 py-2 text-gray-700 rounded-full border border-gray-300 peer-checked:bg-blue-500 peer-checked:text-white peer-checked:border-blue-500 cursor-pointer">
                For someone else
              </div>
            </label>
          </div>
          {errors.bookingFor && (
            <p className="mt-2 text-red-500">This field is required</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Name
          </label>
          <input
            type="text"
            placeholder="Enter name"
            {...control.register("name", { required: true })}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          {errors.name && (
            <p className="mt-2 text-red-500">Name is required</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Mobile Number
          </label>
          <input
            type="tel"
            placeholder="Enter mobile number"
            {...control.register("mobileNo", { required: true })}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          {errors.mobileNo && (
            <p className="mt-2 text-red-500">Mobile number is required</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Email
          </label>
          <input
            type="email"
            placeholder="Enter email"
            {...control.register("email", { required: true })}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          {errors.email && (
            <p className="mt-2 text-red-500">Invalid email format</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Type Org
          </label>
          <select
            {...control.register("typeOrg", { required: true })}
            className="block w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="">Select a type of person</option>
            {Object.keys(filteredRoomCharges).map((t, index) => (
              <option key={t + index} value={t}>
                {removeUnderscore(t)}
              </option>
            ))}
          </select>
          {errors.typeOrg && (
            <p className="mt-2 text-red-500">Type Org is required</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Gender
          </label>
          <div className="flex space-x-4">
            {Object.values(Gender).map((gender, index) => (
              <label key={index} className="flex items-center">
                <input
                  type="radio"
                  value={gender}
                  {...control.register("gender", { required: true })}
                  className="hidden peer"
                />
                <div className="flex items-center space-x-1 px-4 py-2 text-gray-700 rounded-full border border-gray-300 peer-checked:bg-blue-500 peer-checked:text-white peer-checked:border-blue-500 cursor-pointer">
                  <span className="text-lg">
                    {gender === Gender.MALE ? "👤" : gender === Gender.FEMALE ? "👩" : "⚧️"}
                  </span>
                  <span>{gender === Gender.MALE ? "Male" : gender === Gender.FEMALE ? "Female" : "Other"}</span>
                </div>
              </label>
            ))}
          </div>
          {errors.gender && (
            <p className="mt-2 text-red-500">Gender is required</p>
          )}
        </div>


        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Marital Status
          </label>
          <div className="flex space-x-4">
            {Object.values(MaritalStatus).map((status, index) => (
              <label key={index} className="flex items-center">
                <input
                  type="radio"
                  value={status}
                  {...control.register("maritalStatus", { required: true })}
                  className="hidden peer"
                />
                <div className="px-4 py-2 text-gray-700 rounded-full border border-gray-300 peer-checked:bg-blue-500 peer-checked:text-white peer-checked:border-blue-500 cursor-pointer">
                  {status}
                </div>
              </label>
            ))}
          </div>
          {errors.maritalStatus && (
            <p className="mt-2 text-red-500">Marital status is required</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            ID Card Type
          </label>
          <div className="flex flex-wrap gap-2 space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="aadhar"
                {...control.register("idCardType", { required: true })}
                className="hidden peer"
              />
              <div className="px-4 py-2 text-gray-700 rounded-full border border-gray-300 peer-checked:bg-blue-500 peer-checked:text-white peer-checked:border-blue-500 cursor-pointer">
                Aadhar Card
              </div>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="pan"
                {...control.register("idCardType", { required: true })}
                className="hidden peer"
              />
              <div className="px-2 py-2 text-gray-700 rounded-full border border-gray-300 peer-checked:bg-blue-500 peer-checked:text-white peer-checked:border-blue-500 cursor-pointer">
                PAN Card
              </div>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="driving_license"
                {...control.register("idCardType", { required: true })}
                className="hidden peer"
              />
              <div className="px-4 py-2 text-gray-700 rounded-full border border-gray-300 peer-checked:bg-blue-500 peer-checked:text-white peer-checked:border-blue-500 cursor-pointer">
                Driving License
              </div>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="passport"
                {...control.register("idCardType", { required: true })}
                className="hidden peer"
              />
              <div className="px-4 py-2 text-gray-700 rounded-full border border-gray-300 peer-checked:bg-blue-500 peer-checked:text-white peer-checked:border-blue-500 cursor-pointer">
                Passport
              </div>
            </label>
          </div>
          {errors.idCardType && (
            <p className="mt-2 text-red-500">ID card type is required</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            ID Card Number
          </label>
          <input
            type="text"
            placeholder="Enter ID card number"
            {...control.register("idCardNumber", { required: true })}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          {errors.idCardNumber && (
            <p className="mt-2 text-red-500">ID card number is required</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Do you have GST?
          </label>
          <select
            {...control.register("hasGST", { required: true })}
            className="block w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="">Select an option</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
          {errors.hasGST && (
            <p className="mt-2 text-red-500">This field is required</p>
          )}
        </div>

        {hasGST === "yes" && (
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              GST Number
            </label>
            <input
              type="text"
              placeholder="Enter GST number"
              {...control.register("gstNumber", { required: true })}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            {errors.gstNumber && (
              <p className="mt-2 text-red-500">GST number is required</p>
            )}
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Add Guest
        </button>
      </form>
    </div>
  );
}

export default GuestForm;
