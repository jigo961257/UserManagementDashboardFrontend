import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface StatusConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userName: string;
  currentStatus: string; // "Active" or "Inactive"
}

export default function StatusConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  userName,
  currentStatus,
}: StatusConfirmationDialogProps) {
  const newStatus = currentStatus?.toLowerCase() === "active" ? "Inactive" : "Active";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Confirm Status Change</DialogTitle>
          <DialogDescription>
            Are you sure you want to change the status of user{" "}
            <strong>{userName}</strong> from <strong>{currentStatus}</strong> to{" "}
            <strong>{newStatus}</strong>?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-start">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" onClick={onConfirm}>
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
