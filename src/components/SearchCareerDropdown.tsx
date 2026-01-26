import { useEffect, useRef } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { CheckIcon, Search } from "lucide-react";
import type { Client } from "@/helpers/common";

type SearchCarerDropdownProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  onClose: () => void;
  onConfirm: () => void;
  setSearch: (value: string) => void;
  selected?: Client[];
  users?: Client[];
  onSelect: (user: Client) => void;
  placeholder?: string;
};

const SearchCarerDropdown = ({
  open,
  onClose,
  setOpen,
  onConfirm,
  setSearch,
  selected,
  onSelect,
  users,
  placeholder = "Search by team, staff or clients",
}: SearchCarerDropdownProps) => {
  const ref = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (ref.current && open) {
      ref.current.focus();
    }
  }, [open]);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger className="p-0 border-0" asChild>
        <button
          className="search h-[40px] px-2 text-sm w-full gap-2 flex items-center font-normal"
          type="button"
        >
          <Search className="w-4 h-4 shrink-0" />
          <span>{placeholder}</span>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="p-0 w-[300px]"
        sideOffset={Number("-50")}
        onInteractOutside={onClose}
      >
        <div className="p-2 border-b w-full">
          <input
            ref={ref}
            type="text"
            onChange={(e) => setSearch(e.target.value)}
            className="search w-full outline-none px-2 h-[40px] text-sm"
            placeholder="Search by team, staff or clients"
          />
        </div>

        <div className="p-2 max-h-[400px] overflow-y-auto">
          {users &&
            selected &&
            users.map((user, index) => {
              const isSelected = selected.some((v) => v.id === user.id);

              return (
                <div
                  key={user.id}
                  onClick={() => onSelect(user)}
                  className={cn(
                    "flex cursor-pointer items-center gap-3 rounded-md px-2 py-2 text-sm hover:bg-blue-50",
                    { "mt-3": index !== 0 },
                  )}
                >
                  <img
                    src={`https://randomuser.me/api/portraits/men/${index + 1}.jpg`}
                    alt={user.title}
                    className="h-9 w-9 rounded-full object-cover"
                  />

                  <span>{user.title}</span>

                  {isSelected && (
                    <CheckIcon className="ml-auto h-4 w-4 text-blue-600" />
                  )}
                </div>
              );
            })}

          {users && users.length === 0 && (
            <div className="p-2 text-center text-sm text-gray-500">
              No results found
            </div>
          )}
        </div>

        {users && users.length > 0 && (
          <div className="border-t p-2 flex justify-between">
            <button
              type="button"
              onClick={onClose}
              className="rounded border px-4 py-2 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={selected?.length === 0}
              className="rounded cursor-pointer bg-[#1da1f2] px-7 py-2 text-white disabled:opacity-50"
              onClick={onConfirm}
            >
              Apply
            </button>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SearchCarerDropdown;
