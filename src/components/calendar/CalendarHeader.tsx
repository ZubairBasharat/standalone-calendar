import { DatePickerDropdown } from "@/components/DatePickerCalendar";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "../ui/button";
import {
  shiftTypes,
  statusColorMap,
  statuses,
  type CalendarFilters,
  type Client,
  type SelectOptions,
} from "@/helpers/common";
import {
  ChevronLeft,
  ChevronRight,
  EllipsisVertical,
  Grid3X3,
  User2,
} from "lucide-react";
import { DropdownMenu } from "../ui/dropdown-menu";
import {
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
// import MultiStepModal from "./Modals/MultiStepsModal";

interface CalendarHeaderProps {
  title: string;
  view: string;
  calDate: Date;
  filters?: CalendarFilters;
  isExpandView: boolean;
  viewOptions: SelectOptions[];
  addShift?: boolean;
  publishShift?: boolean;
  user?: Client | null;
  setCalDate: (d: Date) => void;
  handlePrev: () => void;
  handleToday: () => void;
  handleNext: () => void;
  handleViewChange: (e: string) => void;
  onGotoDate: (d: Date) => void;
  onExpandView: (value: boolean) => void;
  setFilters?: (value: CalendarFilters) => void;
  onAddClick?: () => void;
  onPublishClick?: () => void;
}

export default function CalendarHeader({
  title,
  view,
  calDate,
  filters,
  isExpandView,
  viewOptions,
  addShift = false,
  publishShift = false,
  user,
  setCalDate,
  handlePrev,
  handleToday,
  handleNext,
  handleViewChange,
  onGotoDate,
  onExpandView,
  setFilters,
  onAddClick,
  onPublishClick,
}: CalendarHeaderProps) {
  const BTN_CLASSES =
    "px-4 py-2 h-[40px] bg-white border text-foreground rounded-[4px] hover:bg-custom-teal hover:text-white cursor-pointer";
  return (
    <>
      <div className="flex items-center justify-between mb-4 z-10 relative">
        {filters && setFilters && (
          <div className="flex gap-2">
            <Select
              value={filters.status}
              onValueChange={(val) => setFilters({ ...filters, status: val })}
            >
              <SelectTrigger className="cursor-pointer ring-0! h-[40px]! outline-none! shadow-none! border bg-white rounded-[4px]">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent
                position="popper"
                className="rounded-[4px] w-40"
                align="start"
              >
                <SelectGroup>
                  {statuses.map((s) => (
                    <SelectItem value={s.id}>
                      <div
                        className={`w-2 h-2 rounded-full ${statusColorMap[s.id]}`}
                      />
                      <span className="text-[12px]">{s.name}</span>
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <Select
              value={filters.shiftType}
              onValueChange={(val) =>
                setFilters({ ...filters, shiftType: val })
              }
            >
              <SelectTrigger className="cursor-pointer ring-0! h-[40px]! outline-none! shadow-none! border bg-white rounded-[4px]">
                <Grid3X3 className="w-3.5! h-3.5!" />
                <SelectValue placeholder="All types" />
              </SelectTrigger>
              <SelectContent
                position="popper"
                className="rounded-[4px] w-40"
                align="start"
              >
                <SelectGroup>
                  {shiftTypes.map((s) => (
                    <SelectItem value={s.id}>
                      <span className="text-[12px]">{s.name}</span>
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <Button className={BTN_CLASSES} onClick={handleToday}>
              Today
            </Button>
          </div>
        )}
        <div className="flex items-center gap-3">
          <Button className={BTN_CLASSES} onClick={handlePrev}>
            <ChevronLeft className="w-5! h-5!" />
          </Button>
          <div className="text-xl font-semibold">{title}</div>
          <Button className={BTN_CLASSES} onClick={handleNext}>
            <ChevronRight className="w-5! h-5!" />
          </Button>
        </div>
        {user && (
          <div className="text-xl font-semibold flex items-center gap-2">
            <User2 className="w-5 h-5" />
            <span className="text-blue-500">{user.title}</span>
          </div>
        )}
        <div className="flex items-center gap-3">
          <Select value={view} onValueChange={(val) => handleViewChange(val)}>
            <SelectTrigger className="ring-0! h-[40px]! cursor-pointer outline-none! shadow-none! border bg-white rounded-[4px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent position={"item-aligned"}>
              <SelectGroup>
                {viewOptions.map((v) => (
                  <SelectItem value={v.id}>{v.name}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <DatePickerDropdown
            onChange={(d) => {
              if (d) {
                setCalDate(d);
                onGotoDate(d);
              }
            }}
            date={calDate}
          />
          {addShift && (
            <Button onClick={onAddClick} className={BTN_CLASSES}>
              Add Shift
            </Button>
          )}
          {publishShift && (
            <Button onClick={onPublishClick} className={BTN_CLASSES}>
              Publish Shift
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant={"outline"}
                className="bg-card hover:bg-card h-[40px] flex items-center cursor-pointer rounded-[4px] justify-center w-[40px]"
              >
                <EllipsisVertical className="w-4 h-4 " />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              sideOffset={4}
              align="end"
              className="bg-white py-2 px-0 rounded-sm w-[220px] z-10 shadow-sm border"
            >
              <DropdownMenuGroup className="px-2 ">
                <DropdownMenuItem className="mb-2 focus:bg-card">
                  Publish Shift
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <div className="flex items-center space-x-2 py-3 px-2">
                <Switch
                  id="expand-view"
                  checked={isExpandView}
                  onCheckedChange={onExpandView}
                />
                <Label htmlFor="expand-view">Expand view</Label>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </>
  );
}
