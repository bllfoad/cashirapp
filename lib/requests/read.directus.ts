'use server';

import { directus } from "../directus/directus";
import { readItems } from "@directus/sdk";
import { Products } from "../types/types";

export const getProductByBarcode = async (barcode: string): Promise<Products | null> => {
  try {
    const products = await directus.request(
      readItems("products", {
        filter: { id: { _eq: barcode } },
        fields: ["*"],
      })
    ) as unknown as Products[];

    return products.length > 0 ? products[0] : null;
  } catch (error) {
    console.error("Error fetching product by barcode", error);
    throw new Error("Error fetching product");
  }
}

