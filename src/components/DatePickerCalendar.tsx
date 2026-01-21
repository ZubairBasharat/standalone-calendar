import React from "react"
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
  const [open, setOpen] = React.useState(false)
    console.log(date)
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="justify-start gap-2">
          <CalendarIcon className="h-4 w-4" />
          {date && date.toDateString()}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        className="p-2"
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
