import { GuestHouse } from "@prisma/client"
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export type TbookingType="BEDS"|"ROOMS"

export function removeUnderscore(word:string) :GuestHouse{
return word.split("_").join(" ") as GuestHouse
}
