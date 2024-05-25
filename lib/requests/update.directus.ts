'use server';
import {directus} from "../directus/directus";
import {updateItem} from "@directus/sdk"

export const updateProductQuantity = async (productId: number, newQuantity: number): Promise<any> => {
    try {
      const updatedProduct = await directus.request(updateItem("products", productId, { stock_quantity: newQuantity }));
      
      return updatedProduct;    
    } catch (error) {
      console.error("Error updating product quantity", error);
      throw new Error("Error updating product quantity");
    }
  }
  