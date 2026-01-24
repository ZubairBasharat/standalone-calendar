export interface CarerResponse {
  id: number;
  title: string;
  hours: string; // API sends as string
  email: string;
  email_verified_at: string; // ISO date string
  type: 'carer' | string;
  created_at: string;
  updated_at: string;
  assigned_schedulers: AssignedScheduler[];
}
export interface AssignedScheduler {
  id: string;
  client_id: string; // API sends string
  title: string;
  start_date: string; // YYYY-MM-DD
  end_date: string;   // YYYY-MM-DD
  start_time: string; // HH:mm:ss
  end_time: string;   // HH:mm:ss
  is_recurring: '0' | '1'; // string from backend
  created_at: string;
  updated_at: string;
  pivot: SchedulerPivot;
}

export interface SchedulerPivot {
  carer_id: string;
  scheduler_id: string;
}

export type CreateShiftPayload = {
  title: string;
  client_id: string;
  carers: string[];
  start_date: string;
  end_date?: string | null;
  start_time: string;
  end_time: string;
  is_recurring: number;
  founder_code?: string;
  call_slot?: string;
  visit_type?: string;
  recurring_days?: string[];
};