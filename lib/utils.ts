import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { Products } from "./types/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const calculateTotalPrice = (products: Products[]): number => {
  return products.reduce((acc, product) => acc + (product.price ?? 0) * (product.quantity ?? 0), 0);
};

export const calculatePricePerProductQuantity = (product: Products): number => {
  return (product.price ?? 0) * (product.quantity ?? 0);
};
