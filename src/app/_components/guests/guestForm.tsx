"use client";
import { FieldError, useForm } from "react-hook-form";
import { useToast } from "~/components/ui/use-toast";
import { api } from "~/trpc/react";
import { Gender, MaritalStatus } from "@prisma/client";
import { removeUnderscore } from "~/lib/utils";
import { useState } from "react";

function GuestForm({ roomCharges }: any) {
  const [apiError, setApiError] = useState("");

  const { toast } = useToast();
  const form = useForm({
    mode: "onChange",
  });

  const createGuestMutation = api.guests.createGuest.useMutation({
    onSuccess: async ({ guest }: any) => {
      window.location.reload();
    },
    onError: (error) => {
      if (error.message.includes("Mobile number")) {
        toast({
          title: "Mobile Number Error",
          description: "Mobile number should be 10 digits",
          variant: "destructive",
        });
      } else {
        setApiError(error.message);
      }
    },
  });
  

  function onSubmit(data: any) {
    setApiError("");
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
  const idCardType = watch("idCardType");

  // Validation patterns
  const idValidationPatterns = {
    aadhar: /^[2-9]{1}[0-9]{3}[0-9]{4}[0-9]{4}$/,
    pan: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
    driving_license: /^(([A-Z]{2}[0-9]{2})( )|([A-Z]{2}-[0-9]{2}))((19|20)[0-9][0-9])[0-9]{7}$/,
    passport: /^[A-Z]{1}[0-9]{7}$/
  };

  const gstPattern = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

  // Custom validation functions
  const validateIdCardNumber = (value: string) => {
    if (!idCardType) return true; // If no ID type is selected, don't validate
    const pattern = idValidationPatterns[idCardType as keyof typeof idValidationPatterns];
    return pattern.test(value) || `Invalid ${idCardType.replace('_', ' ')} number`;
  };

  const validateName = (value: string) => {
    return value.length > 3 || "Name must be more than 3 characters long";
  };

  const validateGST = (value: string) => {
    return gstPattern.test(value) || "Invalid GST number format";
  };

  // Helper function to safely get error message
  const getErrorMessage = (error: any) => {
    if (typeof error === 'string') {
      return error;
    }
    if (error && 'message' in error) {
      return error.message as string;
    }
    return "This field is invalid";
  };


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
            {...control.register("name", { 
              required: "Name is required",
              validate: validateName
            })}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          {errors.name && (
            <p className="mt-2 text-red-500">{getErrorMessage(errors.name)}</p>
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
            {...control.register("idCardNumber", { 
              required: "ID card number is required",
              validate: validateIdCardNumber
            })}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          {errors.idCardNumber && (
            <p className="mt-2 text-red-500">{getErrorMessage(errors.idCardNumber)}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Do you have GST?
          </label>
          <select
            {...control.register("hasGST", { required: "This field is required" })}
            className="block w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="">Select an option</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
          {errors.hasGST && (
            <p className="mt-2 text-red-500">{getErrorMessage(errors.hasGST)}</p>
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
              {...control.register("gstNumber", { 
                required: "GST number is required",
                validate: validateGST
              })}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            {errors.gstNumber && (
              <p className="mt-2 text-red-500">{getErrorMessage(errors.gstNumber)}</p>
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
