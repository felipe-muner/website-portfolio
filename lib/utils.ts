import { clsx, type ClassValue } from "clsx"
import { Metadata } from "next"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

interface GetMetadataProps {
  routeName: string
}

export function getMetadata({ routeName }: GetMetadataProps): Metadata {
  return {
    title: `Gym - ${routeName}`,
    description: "Empower your fitness journey with Gym.",
  }
}