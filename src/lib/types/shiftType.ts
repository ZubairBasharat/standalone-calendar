export type AddShiftType = {
  client_name: string;
  carers: string;
  founder_code: string;
  call_slot: string;
  visit_type: string;
  startDate: Date;
  endDate: Date;
  startTime: string;
  endTime: string;
  recurring: boolean;
  weekdays: string[];
};
