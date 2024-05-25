'use server';

import { directus } from "../directus/directus";
import { readItems, createItem, updateItem, deleteItem } from "@directus/sdk";
import { Products, Orders, OrderItems } from "../types/types";

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

export const confirmOrder = async (products: Products[]): Promise<any> => {
  try {
    const order = await directus.request(createItem("orders", {
      status: "pending",
      total_price: products.reduce((acc, product) => acc + (product.price ?? 0) * product.quantity, 0),
    }));

    const orderItems = [];
    for (const product of products) {
      const orderItem = await directus.request(createItem("order_items", {
        order: order.id,
        product: product.id,
        quantity: product.quantity,
        price: product.price,
      }));
      orderItems.push(orderItem);
    }

    const orderDetails = {
      ...order,
      items: orderItems,
      products,
    };

    return orderDetails;
  } catch (error) {
    console.error("Error creating order", error);
    throw new Error("Error creating order");
  }
}

export const updateProductQuantity = async (productId: number, newQuantity: number): Promise<any> => {
  try {
    const updatedProduct = await directus.request(updateItem("products", productId, { stock_quantity: newQuantity }));
    
    return updatedProduct;
  } catch (error) {
    console.error("Error updating product quantity", error);
    throw new Error("Error updating product quantity");
  }
}

export async function deleteProductFromOrder(orderItemId: number) {
  try {
    await directus.request(deleteItem("order_items", orderItemId));
  } catch (error) {
    console.error("Error deleting product from order", error);
    throw new Error("Error deleting product from order");
  }
}
