
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

export default function AdminGuestForm() {
  const { toast } = useToast()
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
    }
  })

  const x: TCreateGuestValidator = {
    name: "",
    email: "",
    alternativeEmail: "",
    mobileNo: "",
    alternativeMobileNo: "",
    typeOrg: TypeOrg.OTHER,
    orgEmail: "",
    orgPhone: "",
    physicallyChallenged: "NO",
    orgAddress: "",
    country: "INDIA",
    residentialCity: "",
    residentialDistt: "",
    residentialState: "",
    orgName: "",
    orgWebsite: "",
    designation: "",
    nationality: "INDIAN",
    religion: "HINDU",
    fatherHusbandName: "",
    id_card_no: "",
    identity_card_type: "AADHAR",
    maritalStatus: "MARRIED",
    remark: "",
    dob: new Date(),
    permanentAddress: "",
    localAddress: "",
    category: "GEN",
    gender: "MALE",
  }

  const createGuestMutation = api.guests.createGuest.useMutation({
    onSuccess: async ({ guest }:any) => {
      window.location.reload()
    }
  })

  function onSubmit(data: z.infer<typeof CreateGuestValidator>) {
    createGuestMutation.mutate(data)
    toast({
      title: "You submitted the Guest Details:",
    })
  }

  return <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6 ">
      {Object.keys(x).map((key: any, index) => {
        if (!["typeOrg", "physicallyChallenged", "maritalStatus", "residentialState", "nationality", "identity_card_type", "gender", "category", "religion", "country", "userId"].includes(key)) {
          return <FormField
            control={form.control}
            key={key + index}
            name={key}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{PutSpace(key)}</FormLabel>
                <FormControl>
                  <Input placeholder={PutSpace(key).toLowerCase()} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

        }
      })}
      <FormField
        control={form.control}
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
                  return <SelectItem key={t + index} value={t}>{t}</SelectItem>

                })}
              </SelectContent>
            </Select>
            <FormDescription>
              You can manage email addresses in your{" "}
              <Link href="/examples/forms">email settings</Link>.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="physicallyChallenged"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Physically Challenged</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select if physically challenged" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {Object.keys(Answer).map((p, index) => {
                  return <SelectItem key={p + index} value={p}>{p}</SelectItem>
                })}
              </SelectContent>
            </Select>
            <FormDescription>
              Indicate if you have any physical challenges for appropriate accommodations.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      /><FormField
        control={form.control}
        name="maritalStatus"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Marital Status</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select your marital status" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {Object.keys(MaritalStatus).map((m, index) => {
                  return <SelectItem key={m + index} value={m}>{m}</SelectItem>
                })}
              </SelectContent>
            </Select>
            <FormDescription>
              Your marital status helps us to provide better services tailored to your needs.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="nationality"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nationality</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select your nationality" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {Object.keys(Nationality).map((n, index) => (
                  <SelectItem key={n + index} value={n}>{n}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription>
              Your nationality is required for demographic purposes.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="residentialState"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Residential State</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select your residential state" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {Object.keys(State).map((state, index) => (
                  <SelectItem key={state + index} value={state}>{state}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription>
              Select the state of your permanent residence.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="country"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Country</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select your country" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {Object.keys(Country).map((country, index) => (
                  <SelectItem key={country + index} value={country}>{country}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription>
              Choose the country of your citizenship. This is required for legal and administrative purposes.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="religion"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Religion</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select your religion" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {Object.keys(Religion).map((religion, index) => (
                  <SelectItem key={index + religion} value={religion}>{religion}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription>
              Select your religion or belief system. This information is optional and for demographic purposes only.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="category"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Category</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select your category" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {Object.keys(Category).map((category, index) => (
                  <SelectItem key={index + category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription>
              Select the category that best describes you or your organization.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="gender"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Gender</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select your gender" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {Object.keys(Gender).map((gender, index) => (
                  <SelectItem key={gender + index} value={gender}>{gender}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription>
              We ask for gender information for no other reason than to address you correctly.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="identity_card_type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Identity Card Type</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select your ID card type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {Object.keys(IDCardType).map((t, index) => (
                  <SelectItem key={t + index} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription>
              Choose the type of identification document you will provide.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <Button type="submit">Add Guest</Button>
    </form>
  </Form>
}





