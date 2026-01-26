import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface FormInputProps {
  name: string;
  label?: string;
  type?: React.InputHTMLAttributes<HTMLInputElement>["type"];
  placeholder?: string;
  className?: string;
  readOnly?: boolean;
  value?: string;
}

export function FormInput({
  name,
  label,
  type = "text",
  placeholder,
  className,
  readOnly,
  value,
}: FormInputProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = errors[name]?.message as string | undefined;

  return (
    <div className="flex flex-col gap-1">
      {label && <Label htmlFor={name}>{label}</Label>}

      <Input
        id={name}
        type={type}
        placeholder={placeholder}
        aria-invalid={!!error}
        className={cn(error && "border-destructive", className)}
        {...register(name)}
        readOnly={readOnly}
        value={value}
      />

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
