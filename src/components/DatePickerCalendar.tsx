import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CalendarIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Label } from "./ui/label";

export function DatePickerDropdown({
  date,
  onChange,
  pastDisabled = false,
  label,
  error,
}: {
  date: Date | null;
  onChange: (date: Date | null) => void;
  pastDisabled?: boolean;
  label?: string;
  error?: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      {label && <Label htmlFor="date-picker">{label}</Label>}

      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className={`justify-start hover:bg-card gap-2 h-10 rounded-[4px] ${error && "border-destructive"}`}
          >
            <CalendarIcon className="h-4 w-4" />
            {date ? date.toDateString() : "Select date"}
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="p-2 w-63.75">
          <Calendar
            mode="single"
            selected={date ?? undefined}
            onSelect={(d) => {
              onChange(d ?? null);
              setOpen(false);
            }}
            disabled={pastDisabled ? { before: new Date() } : undefined}
            captionLayout="dropdown"
          />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
