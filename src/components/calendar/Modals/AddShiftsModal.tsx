import { useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import SheetModal from "@/components/common/SheetModal";
import {
  BTN_CLASSES_Default,
  BTN_CLASSES_Secondary,
} from "@/components/common/ButtonColors";
import { DatePickerDropdown } from "@/components/DatePickerCalendar";
import { TimePickerDropdown } from "@/components/common/TimePickerDropDown";
import MultiSelectItem from "@/components/common/MultiSelectRadio";
import {
  FormProvider,
  useForm,
  type SubmitHandler,
  useWatch,
  Controller,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  addShiftSchema,
  type AddShiftFormValues,
} from "@/lib/validations/AddShifts";
import { FormCheckbox } from "@/components/common/form/FormCheckbox";
import { FormSelect } from "@/components/common/form/FormSelect";
import type { Client } from "@/helpers/common";
import { FormInput } from "@/components/common/form/FormInput";
import { useCreateEventMutation } from "@/features/api/calendar/events";
import type { CreateShiftPayload } from "@/features/api/types";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface AddShiftsModalProps {
  open: boolean;
  user: Client | null;
  carers: Client[];
  setOpen: (open: boolean) => void;
}

export default function AddShiftsModal({
  open,
  setOpen,
  user,
  carers,
}: AddShiftsModalProps) {
  const weekdays = [
    { id: "0", label: "Mon" },
    { id: "1", label: "Tue" },
    { id: "2", label: "Wed" },
    { id: "3", label: "Thu" },
    { id: "4", label: "Fri" },
    { id: "5", label: "Sat" },
    { id: "6", label: "Sun" },
  ];
  const [createEvent, { isLoading }] = useCreateEventMutation();

  const carersOptions = useMemo(() => {
    return carers.map((c) => ({ value: String(c.id), label: c.title }));
  }, [carers]);

  const founder_codes = [
    { value: "21.5", label: "Bir 21.5" },
    { value: "25.5", label: "Sol 25.5" },
    { value: "20.5", label: "Erd 20.5" },
  ];

  const call_slots = [
    { value: "morning", label: "Morning" },
    { value: "lunch", label: "Lunch" },
    { value: "tea", label: "Tea" },
    { value: "bed", label: "Bed" },
  ];

  const visit_types = [
    { value: "personal_care", label: "Personal Care" },
    { value: "domestic", label: "Domestic" },
    { value: "shopping_call", label: "Shopping Call" },
  ];

  const methods = useForm<AddShiftFormValues>({
    resolver: zodResolver(addShiftSchema),
    defaultValues: {
      client_id: "",
      carers: [],
      founder_code: "",
      call_slot: "",
      visit_type: "",
      start_date: null,
      end_date: null,
      start_time: "",
      end_time: "",
      is_recurring: false,
      recurring_days: weekdays.map((d) => d.id),
    },
  });

  const { handleSubmit, setValue, reset, control } = methods;

  const close = () => {
    setOpen(false);
    reset();
  };

  const onSubmit: SubmitHandler<AddShiftFormValues> = async (data) => {
    const payload: CreateShiftPayload = {
      title: data.title,
      client_id: data.client_id,
      carers: data.carers,
      start_time: data.start_time,
      end_time: data.end_time,
      is_recurring: data.is_recurring ? 1 : 0,
      founder_code: data.founder_code,
      call_slot: data.call_slot,
      visit_type: data.visit_type,
      recurring_days: !data.recurring_days ? [] : data.recurring_days,
      start_date: data.start_date!.toISOString().split("T")[0],

      ...(data.is_recurring
        ? {}
        : {
            end_date: data.end_date!.toISOString().split("T")[0],
          }),
    };

    await createEvent(payload).unwrap();
    close();
  };

  const isRecurring = useWatch({ control, name: "is_recurring" }) ?? false;
  const selectedDays =
    useWatch({ control, name: "recurring_days" }) ?? weekdays.map((d) => d.id);

  const toggleDay = (day: string) => {
    setValue(
      "recurring_days",
      selectedDays.find((d) => d === day)
        ? selectedDays.filter((d) => d !== day)
        : [...selectedDays, day],
    );
  };

  useEffect(() => {
    if (user) {
      setValue("client_id", String(user.id));
    }
  }, [user]);

  return (
    <SheetModal
      open={open}
      onClose={close}
      header={
        <h2 className="text-lg font-semibold text-black dark:text-white">
          Add Shifts
        </h2>
      }
      body={
        <FormProvider {...methods}>
          <div className="overflow-y-auto flex-1 max-h-[calc(90vh-100px)] px-1">
            <form
              id="add-shift-form"
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col space-y-4 px-4"
            >
              <FormInput
                name="title"
                label="Title"
                placeholder="Enter title..."
              />
              <div className="flex flex-col gap-1">
                <FormInput
                  name="client_name"
                  label="Client Name"
                  value={`${user?.title}`}
                  placeholder="Enter name..."
                  readOnly={user ? true : false}
                />
              </div>
              <FormSelect
                name="carers"
                label="Carers"
                options={carersOptions}
                placeholder="Select carers..."
                multiple
              />
              <FormSelect
                name="founder_code"
                label="Founder Code"
                options={founder_codes}
                placeholder="Select founder code..."
              />
              <FormSelect
                name="call_slot"
                label="Call Slot"
                options={call_slots}
                placeholder="Select call slot..."
              />
              <FormSelect
                name="visit_type"
                label="Visit Type"
                options={visit_types}
                placeholder="Select visit type..."
              />
              <Controller
                name="start_date"
                control={control}
                render={({ field, fieldState }) => (
                  <div className="flex flex-col gap-2">
                    <DatePickerDropdown
                      label="Start Date"
                      date={field.value}
                      onChange={field.onChange}
                      pastDisabled
                      error={fieldState.error?.message ? true : false}
                    />
                    {fieldState.error && (
                      <p className="text-xs text-destructive">
                        {fieldState.error.message}
                      </p>
                    )}
                  </div>
                )}
              />

              <Controller
                name="end_date"
                control={control}
                render={({ field, fieldState }) => (
                  <div className="flex flex-col gap-2">
                    <DatePickerDropdown
                      label="End Date"
                      date={field.value}
                      onChange={field.onChange}
                      pastDisabled
                      error={fieldState.error?.message ? true : false}
                    />
                    {fieldState.error && (
                      <p className="text-xs text-destructive">
                        {fieldState.error.message}
                      </p>
                    )}
                  </div>
                )}
              />
              <TimePickerDropdown name="start_time" label="Start Time" />
              <TimePickerDropdown name="end_time" label="End Time" />

              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <FormCheckbox name="is_recurring" label="Recurring" />
                </div>
                {isRecurring && (
                  <div className="flex gap-2 mt-1 flex-wrap">
                    {weekdays.map((day) => (
                      <MultiSelectItem
                        key={day.label}
                        value={day.label}
                        selected={selectedDays.some((d) => d === day.id)}
                        onClick={() => toggleDay(day.id)}
                      />
                    ))}
                  </div>
                )}
              </div>

              <button type="submit" hidden />
            </form>
          </div>
        </FormProvider>
      }
      footer={
        <div className="flex justify-end gap-2 mt-4">
          <Button
            type="button"
            variant="outline"
            className={BTN_CLASSES_Default}
            onClick={close}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="add-shift-form"
            className={cn(BTN_CLASSES_Secondary, "flex items-center gap-1")}
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}Add Shift
          </Button>
        </div>
      }
    />
  );
}
