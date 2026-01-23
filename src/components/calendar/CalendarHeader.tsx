import { useState } from "react";
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
    type SelectOptions,
} from "@/helpers/common";
import {
    ChevronLeft,
    ChevronRight,
    EllipsisVertical,
    Grid3X3,
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
import AddShiftsModal from "./Modals/AddShiftsModal";

interface CalendarHeaderProps {
    title: string;
    view: string;
    calDate: Date;
    filters?: CalendarFilters;
    isExpandView: boolean;
    viewOptions: SelectOptions[];
    addShift?: boolean;
    setCalDate: (d: Date) => void;
    handlePrev: () => void;
    handleToday: () => void;
    handleNext: () => void;
    handleViewChange: (e: string) => void;
    onGotoDate: (d: Date) => void;
    onExpandView: (value: boolean) => void;
    setFilters?: (value: CalendarFilters) => void;
}

export default function CalendarHeader({
    title,
    view,
    calDate,
    filters,
    isExpandView,
    viewOptions,
    addShift = false,
    setCalDate,
    handlePrev,
    handleToday,
    handleNext,
    handleViewChange,
    onGotoDate,
    onExpandView,
    setFilters,
}: CalendarHeaderProps) {
    const BTN_CLASSES =
        "px-4 py-2 h-[40px] bg-white border text-foreground rounded-[4px] hover:bg-blue-600 hover:text-white cursor-pointer";
    const [openStepsSheet, setOpenStepsSheet] = useState(false);
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
                            onValueChange={(val) => setFilters({ ...filters, shiftType: val })}
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
                            setCalDate(d);
                            onGotoDate(d);
                        }}
                        date={calDate}
                    />
                    {addShift && (
                        <Button
                            onClick={() => setOpenStepsSheet(true)}
                            className={BTN_CLASSES}
                        >
                            Add Shift
                        </Button>
                    )}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="bg-white h-[40px] flex items-center cursor-pointer rounded-[4px] justify-center w-[40px]">
                                <EllipsisVertical className="w-4 h-4" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            sideOffset={4}
                            align="end"
                            className="bg-white py-2 px-0 rounded-sm w-[220px] z-10 shadow-sm border"
                        >
                            <DropdownMenuGroup className="px-2">
                                <DropdownMenuItem className="cursor-pointer mb-2">
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
            {/* <MultiStepModal open={openStepsSheet} setOpen={setOpenStepsSheet} /> */}
            <AddShiftsModal open={openStepsSheet} setOpen={setOpenStepsSheet} />
        </>
    );
}
