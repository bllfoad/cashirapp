import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TableCell, TableRow } from "@/components/ui/table";
import { MinusIcon, PlusIcon, TrashIcon } from "../ui/icons";
import { Products } from "@/lib/types/types";
import { calculatePricePerProductQuantity } from "@/lib/utils";
import { handleUpdateQuantity, handleRemoveProduct } from "@/lib/functions/productHandlers";
import { getImageSrc } from "@/lib/helpers/imageHelper";
import Image from "next/image";

interface ProductRowProps {
  product: Products;
  index: number;
  products: Products[];
  setProducts: React.Dispatch<React.SetStateAction<Products[]>>;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
}

const ProductRow: React.FC<ProductRowProps> = ({ product, index, products, setProducts, setErrorMessage }) => {
  return (
    <TableRow className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-[1fr_2fr_1fr_2fr_1fr] items-center">
      <TableCell className="flex justify-center md:justify-start">
        <Image
          width={64}
          height={64}
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
  );
};

export default ProductRow;
