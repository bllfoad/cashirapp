import { Button } from "../ui/button";
import { Dialog } from "../ui/dialog";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ConfirmDialog = ({ isOpen, onClose, onConfirm }: ConfirmDialogProps) => {
  if (!isOpen) return null;
  return (
    <Dialog title="Confirm Order" onClose={onClose} onConfirm={onConfirm}>
      Are you sure you want to confirm the order?
    </Dialog>
  );
};

interface OrderDialogProps {
  isOpen: boolean;
  onClose: () => void;
  orderDetails: any;
  renderReceipt: () => JSX.Element;
  handleDownloadReceipt: () => void;
}

export const OrderDialog = ({ isOpen, onClose, orderDetails, renderReceipt, handleDownloadReceipt }: OrderDialogProps) => {
  if (!isOpen || !orderDetails) return null;
  return (
    <Dialog title="Order Confirmed" onClose={onClose} onConfirm={onClose}>
      <div className="space-y-4">
        {renderReceipt()}
        <Button className="w-full" onClick={handleDownloadReceipt}>
          Download Receipt
        </Button>
        <Button className="w-full" variant="secondary" onClick={onClose}>
          Continue Shopping
        </Button>
      </div>
    </Dialog>
  );
};
