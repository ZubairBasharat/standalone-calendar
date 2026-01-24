import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "@/service/apiService";
import { config } from "@/config";
import type {  CarerResponse, CreateShiftPayload } from "../types";
import type { EventType } from "@/helpers/common";
import { mapSchedulerToEvent } from "@/helpers/common";

export const calendarEventsApi = createApi({
  reducerPath: "eventsApi",
  baseQuery: axiosBaseQuery({
    baseUrl: config.API_BASE_URL,
  }),
  endpoints: (build) => ({
    getAllEvents: build.query<
      EventType[],
      { startDate: string; endDate: string }
    >({
      query: ({ startDate, endDate }) => ({
        url: "/scheduler/all",
        params: {
          start_date: startDate,
          end_date: endDate,
        },
      }),

      transformResponse: (response: {
        schedulers: CarerResponse[];
      }): EventType[] => {
        const events: EventType[] = response.schedulers.flatMap((carer) =>
          carer.assigned_schedulers.map((scheduler) =>
            mapSchedulerToEvent(scheduler),
          ),
        );

        return events;
      },
    }),
    createEvent: build.mutation<EventType, CreateShiftPayload>({
      query: (data) => ({
        url: "/scheduler/create",
        method: "POST",
        data: data
      }),
     })
  }),
});

export const { useGetAllEventsQuery, useCreateEventMutation } = calendarEventsApi;
