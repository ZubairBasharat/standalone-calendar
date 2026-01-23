import { useFormContext, Controller } from "react-hook-form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface Option {
  value: string;
  label: string;
}

interface FormSelectProps {
  name: string;
  label?: string;
  options: Option[];
  placeholder?: string;
  className?: string;
}

export function FormSelect({
  name,
  label,
  options,
  placeholder,
  className,
}: FormSelectProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const error = errors[name]?.message as string | undefined;

  return (
    <div className="flex flex-col gap-1">
      {label && <Label htmlFor={name}>{label}</Label>}

      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Select
            {...field}
            onValueChange={field.onChange}
            value={field.value || ""}
          >
            <SelectTrigger
              id={name}
              className={cn(error && "border-destructive", "w-full", className)}
            >
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className="focus:bg-custom-teal/70 focus:text-white"
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
