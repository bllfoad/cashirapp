'use server';
import { directus } from "../directus/directus";
import { createItem } from "@directus/sdk";
import { Products } from "../types/types";

export const confirmOrder = async (products: Products[]): Promise<any> => {
  try {
    const orderDate = new Date().toISOString(); // Get the current date
    const total_price = products.reduce((acc, product) => acc + (product.price ?? 0) * product.quantity, 0);

    const order = await directus.request(createItem("orders", {
      status: "pending",
      total_price,
      date_created: orderDate, // Include the order date
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
      date_created: orderDate,
    };

    return orderDetails;
  } catch (error) {
    console.error("Error creating order", error);
    throw new Error("Error creating order");
  }
};
