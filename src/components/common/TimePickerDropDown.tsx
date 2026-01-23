import { useState } from "react";
import { useFormContext } from "react-hook-form";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { Clock } from "lucide-react";
import { Label } from "../ui/label";
import { cn } from "@/lib/utils";

interface TimePickerProps {
  name: string;
  label?: string;
  className?: string;
}

export function TimePickerDropdown({
  name,
  label,
  className,
}: TimePickerProps) {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const value = watch(name) as string | undefined;
  const error = errors[name]?.message as string | undefined;

  const [open, setOpen] = useState(false);

  // Generate times in 15 min increments
  const times: string[] = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 15) {
      const hh = h.toString().padStart(2, "0");
      const mm = m.toString().padStart(2, "0");
      times.push(`${hh}:${mm}`);
    }
  }

  return (
    <div className="flex flex-col gap-1">
      {label && <Label htmlFor={name}>{label}</Label>}

      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className={cn(
              "justify-start gap-2 w-full",
              error && "border-destructive",
              className,
            )}
            aria-invalid={!!error}
          >
            <Clock className="w-4 h-4" />
            {value || "Select time"}
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="max-h-70 overflow-y-auto p-2 min-w-[8rem]">
          {times.map((time) => (
            <DropdownMenuItem
              key={time}
              onClick={() => {
                setValue(name, time, { shouldValidate: true });
                setOpen(false);
              }}
              className={cn(
                "px-2 py-1 cursor-pointer rounded",
                value === time && "bg-custom-teal text-white",
              )}
            >
              {time}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
