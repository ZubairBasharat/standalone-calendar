/* ---------------- Action Card ---------------- */

import { Checkbox } from "./ui/checkbox";

export default function ActionCard({
  title,
  description,
  selected,
  onClick,
  disabled = false,
}: {
  title: string;
  description: string;
  selected: boolean;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <div
      className={`text-left border rounded p-4 transition ${
        selected ? "border-custom-teal" : "border-gray-300"
      } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      onClick={!disabled ? onClick : undefined}
    >
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Checkbox
            checked={selected}
            onCheckedChange={onClick}
            disabled={disabled}
          />
          <p className="font-medium text-black dark:text-white">{title}</p>
        </div>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  );
}
