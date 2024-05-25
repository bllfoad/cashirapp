import { toast } from "sonner";
import { Products } from "../types/types";
import { getProductByBarcode } from "@/lib/requests/read.directus";
import { confirmOrder } from "@/lib/requests/create.directus";
import { updateProductQuantity } from "@/lib/requests/update.directus";
import { calculatePricePerProductQuantity } from "../utils";
import jsPDF from "jspdf";
import "jspdf-autotable";

interface HandleAddProductProps {
  barcode: string;
  products: Products[];
  setProducts: React.Dispatch<React.SetStateAction<Products[]>>;
  setLoadingAdd: React.Dispatch<React.SetStateAction<boolean>>;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  setBarcode: React.Dispatch<React.SetStateAction<string>>;
}

export const handleAddProduct = async ({
  barcode, products, setProducts, setLoadingAdd, setErrorMessage, setBarcode
}: HandleAddProductProps) => {
  try {
    setLoadingAdd(true);
    const product = await getProductByBarcode(barcode);
    if (!product) {
      setErrorMessage("Product not found!");
      toast.error("Product not found!");
      setLoadingAdd(false);
      return;
    }

    const existingProductIndex = products.findIndex((p) => p.id === product.id);
    if (existingProductIndex !== -1) {
      const existingProduct = products[existingProductIndex];
      const newQuantity = (existingProduct.quantity ?? 0) + 1;
      if (newQuantity > (existingProduct.stock_quantity ?? 0)) {
        setErrorMessage(`Cannot add more than ${existingProduct.stock_quantity} items.`);
        toast.error(`Cannot add more than ${existingProduct.stock_quantity} items.`);
        setLoadingAdd(false);
        return;
      }
      const updatedProducts = products.map((p, i) =>
        i === existingProductIndex ? { ...p, quantity: newQuantity } : p
      );
      setProducts(updatedProducts);
    } else {
      if ((product.stock_quantity ?? 0) > 0) {
        const updatedProducts = [...products, { ...product, quantity: 1 }];
        setProducts(updatedProducts);
      } else {
        setErrorMessage("Product is out of stock!");
        toast.error("Product is out of stock!");
        setLoadingAdd(false);
        return;
      }
    }
    setBarcode(""); // Clear the barcode input after adding
    toast.success("Product added successfully!");
    setErrorMessage("");
    setLoadingAdd(false);
  } catch (error) {
    console.error("Error adding product:", error);
    setErrorMessage("Error adding product. Please try again.");
    toast.error("Error adding product. Please try again.");
    setLoadingAdd(false);
  }
};

interface HandleUpdateQuantityProps {
  index: number;
  quantity: number;
  products: Products[];
  setProducts: React.Dispatch<React.SetStateAction<Products[]>>;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
}

export const handleUpdateQuantity = ({
  index, quantity, products, setProducts, setErrorMessage
}: HandleUpdateQuantityProps) => {
  if (quantity < 1) {
    setErrorMessage("Quantity cannot be less than 1.");
    toast.error("Quantity cannot be less than 1.");
    return;
  }

  const product = products[index];
  if (quantity > (product.stock_quantity ?? 0)) {
    setErrorMessage(`Cannot add more than ${product.stock_quantity} items.`);
    toast.error(`Cannot add more than ${product.stock_quantity} items.`);
    return;
  }

  const updatedProducts = products.map((p, i) =>
    i === index ? { ...p, quantity } : p
  );
  setProducts(updatedProducts);
  setErrorMessage("");
};

export const handleRemoveProduct = (index: number, products: Products[], setProducts: React.Dispatch<React.SetStateAction<Products[]>>) => {
  const updatedProducts = products.filter((_, i) => i !== index);
  setProducts(updatedProducts);
  toast.success("Product removed successfully!");
};

interface HandleConfirmProps {
  products: Products[];
  setShowConfirmDialog: React.Dispatch<React.SetStateAction<boolean>>;
  setLoadingPay: React.Dispatch<React.SetStateAction<boolean>>;
  setProducts: React.Dispatch<React.SetStateAction<Products[]>>;
  setTotalPrice: React.Dispatch<React.SetStateAction<number>>;
  setConfirmationMessage: React.Dispatch<React.SetStateAction<string>>;
  setOrderDetails: React.Dispatch<React.SetStateAction<any>>;
  setShowOrderDialog: React.Dispatch<React.SetStateAction<boolean>>;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
}

export const handleConfirm = async ({
  products, setShowConfirmDialog, setLoadingPay, setProducts, setTotalPrice,
  setConfirmationMessage, setOrderDetails, setShowOrderDialog, setErrorMessage
}: HandleConfirmProps) => {
  if (products.length === 0) {
    setErrorMessage("No items in the cart.");
    toast.error("No items in the cart.");
    return;
  }

  setShowConfirmDialog(false);
  setLoadingPay(true);
  try {
    const order = await confirmOrder(products);
    for (const product of products) {
      const newStockQuantity = (product.stock_quantity ?? 0) - (product.quantity ?? 0);
      await updateProductQuantity(product.id, newStockQuantity);
    }
    setProducts([]); // Clear the cart after confirming the order
    setTotalPrice(0);
    setConfirmationMessage("Order confirmed successfully!");
    setOrderDetails(order); // Save order details for receipt
    toast.success("Order confirmed successfully!");
    setErrorMessage("");
    setLoadingPay(false);
    setShowOrderDialog(true); // Show the order dialog after confirming
  } catch (error) {
    console.error("Error confirming order:", error);
    setErrorMessage("Error confirming order. Please try again.");
    toast.error("Error confirming order. Please try again.");
    setLoadingPay(false);
  }
};

export const downloadReceiptAsPDF = ({ orderDetails }: { orderDetails: any }) => {
  if (orderDetails) {
    const doc = new jsPDF();

    doc.setFontSize(25);
    doc.text("FreshFood", 20, 10);
    doc.setFontSize(22);
    doc.text("Order Receipt", 20, 20);

    doc.setFontSize(16);
    doc.text(`Order ID: ${orderDetails.id}`, 20, 30);
    doc.text(`Date: ${new Date(orderDetails.date_created).toLocaleDateString()}`, 20, 40); // Add the order date

    const headers = [["Product Name", "Quantity", "Unit Price", "Total"]];
    const data = orderDetails.products.map((product: Products) => [
      product.name,
      product.quantity,
      `$${product.price?.toFixed(2)}`,
      `$${calculatePricePerProductQuantity(product).toFixed(2)}`
    ]);
    //typescript error not allowing to use doc.autoTable its a known issue in jspdf-autotable we can ignore it
    // @ts-ignore
    doc.autoTable({
      startY: 50,
      head: headers,
      body: data,
    });

    doc.setFontSize(16);
    //typescript error not allowing to use doc.autoTable its a known issue in jspdf-autotable we can ignore it
    // @ts-ignore
    doc.text(`Total Price: $${orderDetails.total_price.toFixed(2)}`, 20, doc.autoTable.previous.finalY + 10);

    doc.save(`receipt_order_${orderDetails.id}.pdf`);
  }
};
