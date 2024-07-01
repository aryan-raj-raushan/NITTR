import { z } from 'zod';
import { Gender, MaritalStatus, TypeOrg } from '@prisma/client';

export const CreateGuestValidator = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email().optional(),
  mobileNo: z
    .string()
    .min(10, "Mobile number must be at least 10 digits")
    .max(15, "Mobile number can't be longer than 15 digits"),
  typeOrg: z.nativeEnum(TypeOrg),
  maritalStatus: z.nativeEnum(MaritalStatus),
  gender: z.nativeEnum(Gender),
});

export type TCreateGuestValidator = z.infer<typeof CreateGuestValidator>;
