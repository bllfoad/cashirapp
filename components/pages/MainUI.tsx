"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Navbar } from "../layout/Navbar";
import { MinusIcon, PlusIcon, TrashIcon } from "../ui/icons";
import LeftBar from "../layout/leftBar";
import { Products } from "@/lib/types/types";
import { calculateTotalPrice, calculatePricePerProductQuantity } from "@/lib/utils";
import { handleAddProduct, handleUpdateQuantity, handleRemoveProduct, handleConfirm, handleDownloadReceipt } from "@/lib/functions/productHandlers";
import { ConfirmDialog, OrderDialog } from "../layout/Dialogs";
import { getImageSrc } from "@/lib/helpers/imageHelper";

export function MainUi() {
  const [products, setProducts] = useState<Products[]>([]);
  const [barcode, setBarcode] = useState<string>("");
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [confirmationMessage, setConfirmationMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [loadingAdd, setLoadingAdd] = useState<boolean>(false);
  const [loadingPay, setLoadingPay] = useState<boolean>(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false);
  const [showOrderDialog, setShowOrderDialog] = useState<boolean>(false);
  const [orderDetails, setOrderDetails] = useState<any | null>(null);

  useEffect(() => {
    setTotalPrice(calculateTotalPrice(products));
  }, [products]);

  const renderReceipt = (): JSX.Element => {
    return (
      <div className="p-4 parse text-black bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Order Receipt</h2>
        <p className="mb-2"><strong>Order ID:</strong> {orderDetails?.id}</p>
        <h3 className="text-lg font-semibold mb-2">Products:</h3>
        <ul className="list-disc list-inside mb-2">
          {orderDetails?.products.map((product: Products, index: number) => (
            <li key={index}>
              {product.name} - {product.quantity} x ${product.price} = ${calculatePricePerProductQuantity(product).toFixed(2)}
            </li>
          ))}
        </ul>
        <p className="mt-4"><strong>Total Price:</strong> ${orderDetails?.total_price.toFixed(2)}</p>
      </div>
    );
  };

  return (
    <div className="bg-gray-100 text-white dark:bg-gray-900 min-h-screen flex flex-col items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
      <div className="bg-white dark:bg-gray-800 w-full max-w-6xl rounded-lg shadow-md overflow-hidden">
        <Navbar />
        <div className="flex flex-col md:flex-row">
          <LeftBar
            barcode={barcode}
            setBarcode={setBarcode}
            handleAddProduct={() => handleAddProduct({ barcode, products, setProducts, setLoadingAdd, setErrorMessage, setBarcode })}
            totalPrice={totalPrice}
            handleConfirm={() => setShowConfirmDialog(true)}
            confirmationMessage={confirmationMessage}
            errorMessage={errorMessage}
            loadingAdd={loadingAdd}
            loadingPay={loadingPay}
          />
          <div className="md:w-3/5 p-4 border-r dark:border-gray-700">
            <ScrollArea className="border rounded-md h-[400px] sm:h-[500px] lg:h-[600px] dark:border-gray-700">
              <Table>
                <TableBody>
                  {products.map((product, index) => (
                    <TableRow key={index} className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-[1fr_2fr_1fr_2fr_1fr] items-center">
                      <TableCell className="flex justify-center md:justify-start">
                        <img
                          className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-md"
                          src={getImageSrc(product.image ?? "")}
                          alt={product.name ?? ""}
                        />
                      </TableCell>
                      <TableCell className="flex justify-center md:justify-start">
                        <div className="flex flex-col sm:flex-row sm:items-center space-x-0 sm:space-x-4">
                          <div className="flex gap-2 flex-wrap justify-center sm:justify-start">
                            <div className="text-base font-medium">{product.name}</div>
                            <div className="bg-white p-1 px-2 rounded-3xl text-sm text-gray-500 dark:text-gray-400">
                              ${product.price}
                            </div>
                            <div className="bg-white p-1 px-2 rounded-3xl text-sm text-gray-500 dark:text-gray-400">
                              Total: ${calculatePricePerProductQuantity(product).toFixed(2)}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="flex justify-center md:justify-start">
                        <div className="text-sm text-gray-500 dark:text-gray-400">{product.quantity} pc.</div>
                      </TableCell>
                      <TableCell className="flex justify-center md:justify-start">
                        <div className="flex items-center space-x-2">
                          <Button
                            className="px-2 py-1"
                            variant="secondary"
                            onClick={() => handleUpdateQuantity({ index, quantity: product.quantity - 1, products, setProducts, setErrorMessage })}
                          >
                            <MinusIcon className="h-4 w-4" />
                          </Button>
                          <Input
                            className="w-10 text-center"
                            value={product.quantity}
                            onChange={(e) => handleUpdateQuantity({ index, quantity: Number(e.target.value), products, setProducts, setErrorMessage })}
                          />
                          <Button
                            className="px-2 py-1"
                            variant="secondary"
                            onClick={() => handleUpdateQuantity({ index, quantity: product.quantity + 1, products, setProducts, setErrorMessage })}
                          >
                            <PlusIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="flex justify-center md:justify-start">
                        <Button variant="destructive" onClick={() => handleRemoveProduct(index, products, setProducts)}>
                          <TrashIcon />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>
        </div>
      </div>

      <ConfirmDialog 
        isOpen={showConfirmDialog} 
        onClose={() => setShowConfirmDialog(false)} 
        onConfirm={() => handleConfirm({
          products,
          setShowConfirmDialog,
          setLoadingPay,
          setProducts,
          setTotalPrice,
          setConfirmationMessage,
          setOrderDetails,
          setShowOrderDialog,
          setErrorMessage
        })}
      />

      <OrderDialog 
        isOpen={showOrderDialog} 
        onClose={() => setShowOrderDialog(false)} 
        orderDetails={orderDetails} 
        renderReceipt={renderReceipt}
        handleDownloadReceipt={() => handleDownloadReceipt(orderDetails)}
      />
    </div>
  );
}
