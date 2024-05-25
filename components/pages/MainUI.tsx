"use client";
import React, { useState, useEffect } from "react";
import { Table, TableBody } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Navbar } from "@/components/layout/Navbar";
import LeftBar from "@/components/layout/leftBar";
import { Products } from "@/lib/types/types";
import { calculatePricePerProductQuantity, calculateTotalPrice } from "@/lib/utils";
import { downloadReceiptAsPDF, handleAddProduct, handleConfirm } from "@/lib/functions/productHandlers";
import { ConfirmDialog, OrderDialog } from "@/components/layout/Dialogs";
import ProductRow from "@/components/product/ProductRow";

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
      <div className="p-6 bg-white text-gray-800 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Order Receipt</h2>
        <div className="mb-4">
          <p className="text-lg"><strong>Order ID:</strong> {orderDetails?.id}</p>
          <p className="text-lg"><strong>Date:</strong> {new Date(orderDetails?.date_created).toLocaleDateString()}</p>
        </div>
        <div className="mb-4">
          <h3 className="text-xl font-semibold mb-2">Products:</h3>
          <ul className="divide-y divide-gray-200">
            {orderDetails?.products.map((product: Products, index: number) => (
              <li key={index} className="py-2 flex justify-between items-center">
                <div className="flex-1">
                  <p className="text-lg font-medium">{product.name}</p>
                  <p className="text-sm text-gray-500">{product.quantity} x ${product.price?.toFixed(2)}</p>
                </div>
                <p className="text-lg font-medium">${calculatePricePerProductQuantity(product).toFixed(2)}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="border-t border-gray-200 pt-4">
          <p className="text-lg"><strong>Total Price:</strong> ${orderDetails?.total_price.toFixed(2)}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-100 dark:text-white dark:bg-gray-900 min-h-screen flex flex-col items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
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
                    <ProductRow
                      key={index}
                      product={product}
                      index={index}
                      products={products}
                      setProducts={setProducts}
                      setErrorMessage={setErrorMessage}
                    />
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
        handleDownloadReceipt={() => downloadReceiptAsPDF({ orderDetails })}
      />
    </div>
  );
}
