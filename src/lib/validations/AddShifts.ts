import * as z from "zod";

export const addShiftSchema = z
  .object({
    client_name: z.string().min(1, "* Please Enter a Client Name"),
    carers: z.string().min(1, "* Please Select a carer"),
    founder_code: z.string().min(1, "* Please Select a Founder Code"),
    call_slot: z.string().min(1, "* Please Select a Call Slot"),
    visit_type: z.string().min(1, "* Please Select a Visit Type"),

    startDate: z.date().nullable(),
    endDate: z.date().nullable(),

    startTime: z.string().min(1, "* Please select start time"),
    endTime: z.string().min(1, "* Please select end time"),

    recurring: z.boolean(),
    weekdays: z.array(z.string()).optional(), // Recurring only
  })
  .superRefine((data, ctx) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Required start date
    if (!data.startDate) {
      ctx.addIssue({
        path: ["startDate"],
        message: "* Please select a start date",
        code: z.ZodIssueCode.custom,
      });
    }

    // Required end date
    if (!data.endDate) {
      ctx.addIssue({
        path: ["endDate"],
        message: "* Please select an end date",
        code: z.ZodIssueCode.custom,
      });
    }

    // Stop further checks if either is missing
    if (!data.startDate || !data.endDate) return;

    // Start date in the past
    if (data.startDate < today) {
      ctx.addIssue({
        path: ["startDate"],
        message: "* Start date cannot be in the past",
        code: z.ZodIssueCode.custom,
      });
    }

    // End date before start date
    if (data.endDate < data.startDate) {
      ctx.addIssue({
        path: ["endDate"],
        message: "* End date must be after start date",
        code: z.ZodIssueCode.custom,
      });
    }

    // Recurring but no weekdays selected
    if (data.recurring && (!data.weekdays || data.weekdays.length === 0)) {
      ctx.addIssue({
        path: ["weekdays"],
        message: "* Please select at least one weekday",
        code: z.ZodIssueCode.custom,
      });
    }

    // End time before start time
    if (data.startTime && data.endTime && data.endTime <= data.startTime) {
      ctx.addIssue({
        path: ["endTime"],
        message: "* End time must be after start time",
        code: z.ZodIssueCode.custom,
      });
    }

    if (data.recurring && (!data.weekdays || data.weekdays.length === 0)) {
      ctx.addIssue({
        path: ["weekdays"],
        message: "* Please select at least one weekday",
        code: z.ZodIssueCode.custom,
      });
    }
  });

export type AddShiftFormValues = z.infer<typeof addShiftSchema>;
