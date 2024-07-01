import { Gender, MaritalStatus, TypeOrg } from "@prisma/client";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  CreateGuestValidator,
  TCreateGuestValidator,
} from "~/utils/validators/guestValidators";
import { z } from "zod";
import { useToast } from "~/components/ui/use-toast";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { removeUnderscore } from "~/lib/utils";

export default function AdminGuestForm() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof CreateGuestValidator>>({
    resolver: zodResolver(CreateGuestValidator),
    defaultValues: {
      name: "",
      email: "",
      mobileNo: "",
      typeOrg: TypeOrg.OTHER,
      maritalStatus: MaritalStatus.MARRIED,
      gender: Gender.MALE,
    },
  });

  const x: TCreateGuestValidator = {
    name: "",
    email: "",
    mobileNo: "",
    typeOrg: TypeOrg.OTHER,
    maritalStatus: "MARRIED",
    gender: "MALE",
  };

  const createGuestMutation = api.guests.createGuest.useMutation({
    onSuccess: async ({ guest }: any) => {
      window.location.reload();
    },
  });

  function onSubmit(data: z.infer<typeof CreateGuestValidator>) {
    createGuestMutation.mutate(data);
    toast({
      title: "You submitted the Guest Details:",
    });
  }

  const {
    handleSubmit,
    formState: { errors },
    control,
  } = form;


  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="w-2/3 space-y-6 ">
        {Object.keys(x).map((key: any, index) => {
          if (!["typeOrg", "maritalStatus", "gender", "userId"].includes(key)) {
            return (
              <FormField
                control={control}
                key={key + index}
                name={key}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="capitalize">{removeUnderscore(key)}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={removeUnderscore(key).toUpperCase()}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            );
          }
        })}
        <FormField
          control={control}
          name="typeOrg"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type Org</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a typeOrg" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.keys(TypeOrg).map((t, index) => {
                    return (
                      <SelectItem key={t + index} value={t}>
                        {removeUnderscore(t)}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              <FormDescription>This field is mandatory!</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="gender"
          render={({ field }) => (
            <div className="mb-4">
              <FormLabel>Gender</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
          control={form.control}
          name="maritalStatus"
          render={({ field }) => (
            <div className="mb-4">
              <FormLabel>Marital Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                <p className="mt-2 text-red-500">Marital status is required</p>
              )}
            </div>
          )}
        />

        <Button type="submit">Add Guest</Button>
      </form>
    </Form>
  );
}
