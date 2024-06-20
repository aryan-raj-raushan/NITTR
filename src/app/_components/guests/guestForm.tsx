
import { Answer, Category, Country, Gender, IDCardType, MaritalStatus, Nationality, Religion, State, TypeOrg } from "@prisma/client";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form"
import { Input } from '~/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { CreateGuestValidator, TCreateGuestValidator } from '~/utils/validators/guestValidators';
import { z } from 'zod';
import { useToast } from '~/components/ui/use-toast';
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import Link from "next/link";


function PutSpace(str: string) {
  let res = str.replace(/([A-Z])/g, ' $&')
  res = res.toUpperCase()
  return res
}

const GuestForm = ({roomCharges}:any) => {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof CreateGuestValidator>>({
    resolver: zodResolver(CreateGuestValidator),
    defaultValues: {
      name: "",
      email: "",
      alternativeEmail: "",
      mobileNo: "",
      alternativeMobileNo: "",
      typeOrg: TypeOrg.OTHER,
      orgEmail: "",
      orgPhone: "",
      physicallyChallenged: Answer.NO,
      orgAddress: "",
      country: Country.INDIA,
      residentialCity: "",
      residentialDistt: "",
      residentialState: State.MAHARASTRA,
      orgName: "",
      orgWebsite: "",
      designation: "",
      nationality: Nationality.NRI,
      religion: Religion.HINDU,
      fatherHusbandName: "",
      id_card_no: "",
      identity_card_type: IDCardType.AADHAR,
      maritalStatus: MaritalStatus.MARRIED,
      remark: "",
      dob: new Date(),
      permanentAddress: "",
      localAddress: "",
      category: Category.SC,
      gender: Gender.MALE,
    },
  });

  const x: TCreateGuestValidator = {
    name: "",
    email: "email123@gmail.com",
    alternativeEmail: "email123@gmail.com",
    mobileNo: "0000000000",
    alternativeMobileNo: "0000000000",
    typeOrg: TypeOrg.OTHER,
    orgEmail: "email123@gmail.com",
    orgPhone: "0000000000",
    physicallyChallenged: "NO",
    orgAddress: "",
    country: "INDIA",
    residentialCity: "",
    residentialDistt: "",
    residentialState: "MAHARASTRA",
    orgName: "",
    orgWebsite: "",
    designation: "",
    nationality: "NRI",
    religion: "HINDU",
    fatherHusbandName: "",
    id_card_no: "",
    identity_card_type: "AADHAR",
    maritalStatus: "MARRIED",
    remark: "",
    dob: new Date(),
    permanentAddress: "",
    localAddress: "",
    category: "SC",
    gender: "MALE",
  };

  const createGuestMutation = api.guests.createGuest.useMutation({
    onSuccess: async ({ guest }: any) => {
      window.location.reload();
    },
  });

  const onSubmit = (data: z.infer<typeof CreateGuestValidator>) => {
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

  return (
    <div className="overflow-auto h-full w-full flex justify-center">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
            control={form.control}
            name="typeOrg"
            render={({ field }) => (
              <div className="mb-4">
                <FormLabel>Type Org</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a type of person" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(filteredRoomCharges).map((t, index) => (
                      <SelectItem key={t + index} value={t}>
                        {PutSpace(t)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  <span className="text-red-500 mt-4">This Field is mandatory to Fill</span>
                </FormDescription>
                <FormMessage />
              </div>
            )}
          />
          {Object.keys(x).map((key: any, index) => {
            if (!["typeOrg", "physicallyChallenged", "maritalStatus", "residentialState", "nationality", "identity_card_type", "gender", "category", "religion", "country", "userId"].includes(key)) {
              return <FormField
                control={form.control}
                key={key + index}
                name={key}
                render={({ field }) => (
                  <div className="mb-4">
                    <FormLabel>{PutSpace(key)}</FormLabel>
                    <FormControl>
                      <Input placeholder={PutSpace(key).toLowerCase()} {...field} />
                    </FormControl>
                    <FormMessage />
                  </div>
                )}
              />
            }
          })}



          {/* Add other FormField components as needed */}

          <Button
            onClick={() => {
              const a = CreateGuestValidator.safeParse(form.getValues());
            }}
            type="submit"
          >
            Add Guest
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default GuestForm;
 