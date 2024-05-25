import { Button } from "../ui/button";
import { DollarSignIcon, PlusIcon } from "../ui/icons";
import { BarcodeIcon } from "lucide-react";
import { Input } from "../ui/input";
import ShimmerButton from "../magicui/shimmer-button";

interface LeftBarProps {
  barcode: string;
  setBarcode: React.Dispatch<React.SetStateAction<string>>;
  handleAddProduct: () => void;
  totalPrice: number;
  handleConfirm: () => void;
  confirmationMessage: string;
  errorMessage: string;
  loadingAdd: boolean;
  loadingPay: boolean;
}

const LeftBar = ({ barcode, setBarcode, handleAddProduct, totalPrice, handleConfirm, confirmationMessage, errorMessage, loadingAdd, loadingPay }: LeftBarProps) => {
  return (
    <div className="md:w-2/5 p-4 space-y-4">
      
      <div className="relative">
        <BarcodeIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
        <Input
          className="pl-10 dark:bg-gray-800 dark:text-gray-50"
          placeholder="Barcode search"
          value={barcode}
          onChange={(e) => setBarcode(e.target.value)}
        />
      </div>
      <Button className="w-full" variant="secondary" onClick={handleAddProduct} disabled={loadingAdd}>
        <PlusIcon className="h-5 w-5 mr-2" />
        Add Product
        {loadingAdd && <div className="ml-2 h-5 w-5 animate-pulse">adding...</div>}
      </Button>
      <div className="text-lg font-medium border-gray-100 dark:border-gray-900 border-dashed border-t-[0.1px] py-5 border-b-[0.1px]">Total Price: ${totalPrice.toFixed(2)}</div>
      <ShimmerButton disabled={loadingPay || totalPrice === 0} onClick={handleConfirm} className={` w-full  `}>
      <div className="w-full text-white flex justify-center items-center h-12 bg-black" >
        <DollarSignIcon className="h-5 w-5 mr-2" />
        Pay
        {loadingPay && <div className="ml-2 h-5 w-5 animate-pulse">processing...</div>}
      </div>
      </ShimmerButton>
    </div>
  );
};

export default LeftBar;
