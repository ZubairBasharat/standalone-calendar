import * as z from "zod";

export const addShiftSchema = z
  .object({
    title: z.string().min(1, "* Please Enter a Title"),
    client_id: z.string().min(1, "* Please Enter a Client Name"),
    carers: z.array(z.string()).min(1, "* Please Select a carer"),
    founder_code: z.string().optional(),
    call_slot: z.string().optional(),
    visit_type: z.string().optional(),

    start_date: z.date().nullable(),
    end_date: z.date().nullable(),

    start_time: z.string().min(1, "* Please select start time"),
    end_time: z.string().min(1, "* Please select end time"),

    is_recurring: z.boolean(),
    recurring_days: z.array(z.string()).optional(),
  })
  .superRefine((data, ctx) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 1️⃣ Start date required
    if (!data.start_date) {
      ctx.addIssue({
        path: ["start_date"],
        message: "* Please select a start date",
        code: z.ZodIssueCode.custom,
      });
      return;
    }

    // 2️⃣ End date required only if NOT recurring
    if (!data.is_recurring && !data.end_date) {
      ctx.addIssue({
        path: ["end_date"],
        message: "* Please select an end date",
        code: z.ZodIssueCode.custom,
      });
      return;
    }

    // 3️⃣ Start date cannot be in past
    if (data.start_date < today) {
      ctx.addIssue({
        path: ["start_date"],
        message: "* Start date cannot be in the past",
        code: z.ZodIssueCode.custom,
      });
    }

    // 4️⃣ If end_date exists (recurring or not), compare
    if (data.end_date && data.end_date < data.start_date) {
      ctx.addIssue({
        path: ["end_date"],
        message: "* End date must be after start date",
        code: z.ZodIssueCode.custom,
      });
    }

    // 5️⃣ Time validation
    if (data.start_time && data.end_time && data.end_time <= data.start_time) {
      ctx.addIssue({
        path: ["end_time"],
        message: "* End time must be after start time",
        code: z.ZodIssueCode.custom,
      });
    }

    // 6️⃣ Recurring weekdays
    if (data.is_recurring && (!data.recurring_days || data.recurring_days.length === 0)) {
      ctx.addIssue({
        path: ["recurring_days"],
        message: "* Please select at least one weekday",
        code: z.ZodIssueCode.custom,
      });
    }
  });

export type AddShiftFormValues = z.infer<typeof addShiftSchema>;
