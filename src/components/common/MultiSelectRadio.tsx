import { CircleIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MultiSelectItemProps {
  value: string;
  selected: boolean;
  onClick: () => void;
  className?: string;
}

export default function MultiSelectItem({
  value,
  selected,
  onClick,
  className,
}: MultiSelectItemProps) {
  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={onClick}
        className={cn(
          "cursor-pointer relative flex items-center justify-center rounded-full border shadow-xs transition-colors aspect-square w-4 h-4",
          selected ? "" : "bg-input dark:bg-input/30 ",
          className,
        )}
      >
        {selected && (
          <CircleIcon className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 fill-black w-2 h-2" />
        )}
      </button>

      <span>{value}</span>
    </div>
  );
}
