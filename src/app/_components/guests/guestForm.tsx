import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CreateGuestValidator } from "~/utils/validators/guestValidators";
import { z } from "zod";
import { useToast } from "~/components/ui/use-toast";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Form, FormField, FormLabel } from "~/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Gender, MaritalStatus } from "@prisma/client";
import { removeUnderscore } from "~/lib/utils";

// Extend the CreateGuestValidator to include new fields
const ExtendedCreateGuestValidator = CreateGuestValidator.extend({
  bookingFor: z.enum(["self", "someone_else"]),
  idCardType: z.string(),
  idCardNumber: z.string(),
  hasGST: z.boolean(),
  gstNumber: z.string().optional(),
});

function GuestForm({ roomCharges }: any) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof ExtendedCreateGuestValidator>>({
    resolver: zodResolver(ExtendedCreateGuestValidator),
  });

  const createGuestMutation = api.guests.createGuest.useMutation({
    onSuccess: async ({ guest }: any) => {
      window.location.reload();
    },
  });

  function onSubmit(data: z.infer<typeof ExtendedCreateGuestValidator>) {
    createGuestMutation.mutate(data);
    toast({
      title: "You submitted the Guest Details:",
    });
  }

  const filteredRoomCharges = Object.fromEntries(
    Object.entries(roomCharges).filter(
      ([key, value]) => value !== null && key !== "hostelName" && key !== "id",
    ),
  );

  const {
    handleSubmit,
    formState: { errors },
    control,
    watch,
  } = form;

  const hasGST = watch("hasGST");

  return (
    <div className="flex h-full w-full justify-center overflow-auto">
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="w-2/3 space-y-6">
          <FormField
            control={control}
            name="bookingFor"
            render={({ field }) => (
              <div className="mb-4">
                <FormLabel>Who are you booking for?</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select booking type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="self">For myself</SelectItem>
                    <SelectItem value="someone_else">For someone else</SelectItem>
                  </SelectContent>
                </Select>
                {errors.bookingFor && (
                  <p className="mt-2 text-red-500">This field is required</p>
                )}
              </div>
            )}
          />

          <FormField
            control={control}
            name="name"
            render={({ field }) => (
              <div className="mb-4">
                <FormLabel>Name</FormLabel>
                <Input placeholder="Enter name" {...field} />
                {errors.name && (
                  <p className="mt-2 text-red-500">Name is required</p>
                )}
              </div>
            )}
          />

          <FormField
            control={control}
            name="mobileNo"
            render={({ field }) => (
              <div className="mb-4">
                <FormLabel>Mobile Number</FormLabel>
                <Input
                  type="tel"
                  placeholder="Enter mobile number"
                  {...field}
                />
                {errors.mobileNo && (
                  <p className="mt-2 text-red-500">Mobile number is required</p>
                )}
              </div>
            )}
          />

          <FormField
            control={control}
            name="email"
            render={({ field }) => (
              <div className="mb-4">
                <FormLabel>Email</FormLabel>
                <Input type="email" placeholder="Enter email" {...field} />
                {errors.email && (
                  <p className="mt-2 text-red-500">Invalid email format</p>
                )}
              </div>
            )}
          />

          <FormField
            control={control}
            name="typeOrg"
            render={({ field }) => (
              <div className="mb-4">
                <FormLabel>Type Org</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a type of person" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(filteredRoomCharges).map((t, index) => (
                      <SelectItem key={t + index} value={t}>
                        {removeUnderscore(t)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.typeOrg && (
                  <p className="mt-2 text-red-500">Type Org is required</p>
                )}
              </div>
            )}
          />

          <FormField
            control={control}
            name="gender"
            render={({ field }) => (
              <div className="mb-4">
                <FormLabel>Gender</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your gender" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(Gender).map((gender, index) => (
                      <SelectItem key={index} value={gender}>
                        {gender}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.gender && (
                  <p className="mt-2 text-red-500">Gender is required</p>
                )}
              </div>
            )}
          />

          <FormField
            control={control}
            name="maritalStatus"
            render={({ field }) => (
              <div className="mb-4">
                <FormLabel>Marital Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your marital status" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(MaritalStatus).map((status, index) => (
                      <SelectItem key={index} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.maritalStatus && (
                  <p className="mt-2 text-red-500">
                    Marital status is required
                  </p>
                )}
              </div>
            )}
          />

          <FormField
            control={control}
            name="idCardType"
            render={({ field }) => (
              <div className="mb-4">
                <FormLabel>ID Card Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select ID card type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="aadhar">Aadhar Card</SelectItem>
                    <SelectItem value="pan">PAN Card</SelectItem>
                    <SelectItem value="driving_license">Driving License</SelectItem>
                    <SelectItem value="passport">Passport</SelectItem>
                  </SelectContent>
                </Select>
                {errors.idCardType && (
                  <p className="mt-2 text-red-500">ID card type is required</p>
                )}
              </div>
            )}
          />

          <FormField
            control={control}
            name="idCardNumber"
            render={({ field }) => (
              <div className="mb-4">
                <FormLabel>ID Card Number</FormLabel>
                <Input placeholder="Enter ID card number" {...field} />
                {errors.idCardNumber && (
                  <p className="mt-2 text-red-500">ID card number is required</p>
                )}
              </div>
            )}
          />

          <FormField
            control={control}
            name="hasGST"
            render={({ field }) => (
              <div className="mb-4">
                <FormLabel>Do you have GST?</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(value === "yes")}
                  defaultValue={field.value ? "yes" : "no"}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select GST status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          />

          {hasGST && (
            <FormField
              control={control}
              name="gstNumber"
              render={({ field }) => (
                <div className="mb-4">
                  <FormLabel>GST Number</FormLabel>
                  <Input placeholder="Enter GST number" {...field} />
                  {errors.gstNumber && (
                    <p className="mt-2 text-red-500">GST number is required</p>
                  )}
                </div>
              )}
            />
          )}

          <Button type="submit">Add Guest</Button>
        </form>
      </Form>
    </div>
  );
}

export default GuestForm;