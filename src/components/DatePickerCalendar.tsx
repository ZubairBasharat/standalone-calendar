import { useState } from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { CalendarIcon } from "lucide-react"
import { Button } from "./ui/button"
import { Calendar } from "./ui/calendar"

export function DatePickerDropdown({
    onChange,
    date,
}:
{
    date: Date
    onChange: (date: Date) => void
}) {
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild className="bg-white ring-0! outline-none! h-[40px] shadow-none! rounded-[4px] border cursor-pointer">
        <Button variant="outline" className="justify-start gap-2">
          <CalendarIcon className="h-4 w-4" />
          {date && date.toDateString()}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="p-2 w-[255px]"
      >
        <Calendar
          mode="single"
          selected={date}
          required
          onSelect={(date) => {
            onChange(date)
            setOpen(false)
          }}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
