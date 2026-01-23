import { Controller, useFormContext } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface FormCheckboxProps {
  name: string;
  label?: string;
  className?: string;
}

export function FormCheckbox({ name, label, className }: FormCheckboxProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <div className={cn("flex items-center gap-2", className)}>
          <Checkbox
            checked={field.value}
            onCheckedChange={(checked) => field.onChange(!!checked)}
          />
          {label && <Label>{label}</Label>}
        </div>
      )}
    />
  );
}
