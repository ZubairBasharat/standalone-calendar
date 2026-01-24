import { createApi } from '@reduxjs/toolkit/query/react';
import axiosBaseQuery from '@/service/apiService';
import { config } from '@/config';
import type { Client } from '@/helpers/common';

export const usersApi = createApi({
  reducerPath: 'usersApi',
  baseQuery: axiosBaseQuery({
    baseUrl: config.API_BASE_URL,
  }),
  endpoints: (build) => ({
    allUsers: build.query<Client[], void>({
      query: () => ({
        url: `/user/all`,
        method: 'GET',
      }),
       transformResponse: (response: { users: Client[] }) => response.users.filter((x) => x.type== "carer"),
    }),
  }),
});

export const { useAllUsersQuery } = usersApi;