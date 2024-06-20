import { Answer, Category, Country, Gender, IDCardType, MaritalStatus, Nationality, Religion, State, TypeOrg } from "@prisma/client";
import { z } from "zod";

export const CreateGuestValidator = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  alternativeEmail: z.string(),
  mobileNo: z.string().min(10, "Mobile number must be at least 10 digits").max(15, "Mobile number can't be longer than 15 digits"),
  alternativeMobileNo: z.string(),
  typeOrg: z.custom<TypeOrg>(),
  orgEmail: z.string(),
  orgPhone: z.string(),
  physicallyChallenged: z.custom<Answer>(),
  orgAddress: z.string(),
  country: z.custom<Country>(),
  residentialState: z.string().min(1, "Residential state is required"),
  residentialDistt: z.string(),
  residentialCity: z.string().min(1, "Residential city is required"),
  orgWebsite: z.string(),
  orgName: z.string(),
  designation: z.string(),
  religion: z.custom<Religion>(),
  nationality: z.custom<Nationality>(),
  fatherHusbandName: z.string(),
  id_card_no: z.string(),
  identity_card_type: z.custom<IDCardType>(),
  maritalStatus: z.custom<MaritalStatus>(),
  remark: z.string().optional(),
  dob: z.date().refine(date => date <= new Date(), "Date of birth must be in the past"),
  permanentAddress: z.string().min(1, "Permanent address is required"),
  localAddress: z.string().min(1, "Local address is required"),
  category: z.custom<Category>(),
  gender: z.custom<Gender>(),
});

export type TCreateGuestValidator = z.infer<typeof CreateGuestValidator>;
