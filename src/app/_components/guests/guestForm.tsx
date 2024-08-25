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

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
            Name
          </label>
          <input
            id="name"
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
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="mobileNo">
            Mobile Number
          </label>
          <input
            id="mobileNo"
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
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Email
          </label>
          <input
            id="email"
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
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="typeOrg">
            Type Org
          </label>
          <select
            id="typeOrg"
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
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="gender">
            Gender
          </label>
          <select
            id="gender"
            {...control.register("gender", { required: true })}
            className="block w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="">Select your gender</option>
            {Object.values(Gender).map((gender, index) => (
              <option key={index} value={gender}>
                {gender}
              </option>
            ))}
          </select>
          {errors.gender && (
            <p className="mt-2 text-red-500">Gender is required</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="maritalStatus">
            Marital Status
          </label>
          <select
            id="maritalStatus"
            {...control.register("maritalStatus", { required: true })}
            className="block w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="">Select your marital status</option>
            {Object.values(MaritalStatus).map((status, index) => (
              <option key={index} value={status}>
                {status}
              </option>
            ))}
          </select>
          {errors.maritalStatus && (
            <p className="mt-2 text-red-500">Marital status is required</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="idCardType">
            ID Card Type
          </label>
          <select
            id="idCardType"
            {...control.register("idCardType", { required: true })}
            className="block w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="">Select ID card type</option>
            <option value="aadhar">Aadhar Card</option>
            <option value="pan">PAN Card</option>
            <option value="driving_license">Driving License</option>
            <option value="passport">Passport</option>
          </select>
          {errors.idCardType && (
            <p className="mt-2 text-red-500">ID card type is required</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="idCardNumber">
            ID Card Number
          </label>
          <input
            id="idCardNumber"
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
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="hasGST">
            Do you have GST?
          </label>
          <select
            id="hasGST"
            {...control.register("hasGST", { required: true })}
            className="block w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>

        {hasGST && (
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="gstNumber">
              GST Number
            </label>
            <input
              id="gstNumber"
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
