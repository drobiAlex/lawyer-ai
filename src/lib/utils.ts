import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  adjectives,
  animals,
  colors,
  uniqueNamesGenerator,
} from "unique-names-generator";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const uniqueId = () => Math.random().toString(36).slice(2, 9);

export const randomName = () =>
  uniqueNamesGenerator({
    dictionaries: [adjectives, colors, animals],
    separator: " ",
  });

export function capitalizeNodeType(str: string): string {
  const nodeType = str.charAt(0).toUpperCase() + str.slice(1);
  return nodeType.split("_").join(" ");
}
