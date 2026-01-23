import type { ReactNode } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  CustomSheetFooter,
} from "../ui/sheet";
import { Separator } from "../ui/separator";

interface SheetModalProps {
  open: boolean;
  onClose: () => void;
  header?: ReactNode;
  body?: ReactNode;
  footer?: ReactNode;
}

export default function SheetModal({
  open,
  onClose,
  header,
  body,
  footer,
}: SheetModalProps) {
  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent>
        {header && <SheetHeader>{header}</SheetHeader>}
        <Separator />
        {body && <SheetDescription>{body}</SheetDescription>}

        {footer && <CustomSheetFooter>{footer}</CustomSheetFooter>}
      </SheetContent>
    </Sheet>
  );
}
