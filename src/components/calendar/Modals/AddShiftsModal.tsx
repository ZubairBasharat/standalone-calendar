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
import { FormInput } from "@/components/common/form/FormInput";
import { FormSelect } from "@/components/common/form/FormSelect";

interface AddShiftsModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function AddShiftsModal({ open, setOpen }: AddShiftsModalProps) {
  const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const carers = [
    { value: "talal", label: "Talal" },
    { value: "waleed", label: "Waleed" },
    { value: "iqra", label: "Iqra" },
  ];

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
      client_name: "",
      carers: "",
      founder_code: "",
      call_slot: "",
      visit_type: "",
      startDate: null,
      endDate: null,
      startTime: "",
      endTime: "",
      recurring: false,
      weekdays, // All selected by default
    },
  });

  const { handleSubmit, setValue, reset, control } = methods;

  const close = () => {
    setOpen(false);
    reset();
  };

  const onSubmit: SubmitHandler<AddShiftFormValues> = (data) => {
    console.log("Form Data:", data);
    close();
  };

  const isRecurring = useWatch({ control, name: "recurring" }) ?? false;
  const selectedDays = useWatch({ control, name: "weekdays" }) ?? weekdays;

  const toggleDay = (day: string) => {
    setValue(
      "weekdays",
      selectedDays.includes(day)
        ? selectedDays.filter((d) => d !== day)
        : [...selectedDays, day],
    );
  };

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
                name="client_name"
                label="Client Name"
                placeholder="Enter name..."
              />
              <FormSelect
                name="carers"
                label="Carers"
                options={carers}
                placeholder="Select carers..."
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
                name="startDate"
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
                name="endDate"
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
              <TimePickerDropdown name="startTime" label="Start Time" />
              <TimePickerDropdown name="endTime" label="End Time" />

              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <FormCheckbox name="recurring" label="Recurring" />
                </div>
                {isRecurring && (
                  <div className="flex gap-2 mt-1 flex-wrap">
                    {weekdays.map((day) => (
                      <MultiSelectItem
                        key={day}
                        value={day}
                        selected={selectedDays.includes(day)}
                        onClick={() => toggleDay(day)}
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
            className={BTN_CLASSES_Secondary}
          >
            Add Shift
          </Button>
        </div>
      }
    />
  );
}
