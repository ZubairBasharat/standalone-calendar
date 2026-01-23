import { Button } from "@/components/ui/button";
import SheetModal from "@/components/common/SheetModal";
import {
  BTN_CLASSES_Default,
  BTN_CLASSES_Secondary,
} from "@/components/common/ButtonColors";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface AddShiftsModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function AddShiftsModal({ open }: AddShiftsModalProps) {
  return (
    <SheetModal
      open={open}
      onClose={close}
      header={
        <h2 className="text-lg font-semibold text-black dark:text-white">
          Add Shifts
        </h2>
      }
      body={
        <div className="flex flex-col gap-4 px-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="shift-title">Title</Label>
            <Input id="shift-title" placeholder="Enter shift title..." />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="shift-description">Description</Label>
            <Input
              id="shift-description"
              placeholder="Enter shift description..."
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="shift-careers">Careers</Label>
          </div>
        </div>
      }
      footer={
        <div className="flex justify-end gap-2 mt-4">
          <Button
            className={BTN_CLASSES_Default}
            variant="outline"
            onClick={close}
          >
            Cancel
          </Button>

          <Button
            onClick={() => alert("clicked")}
            className={BTN_CLASSES_Secondary}
          >
            Add Shift
          </Button>
        </div>
      }
    />
  );
}
