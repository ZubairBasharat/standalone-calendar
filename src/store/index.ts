import { usersApi } from '@/features/api/users';
import { calendarEventsApi } from '@/features/api/calendar/events';
import { combineReducers, configureStore, type Middleware } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';

const apiMiddlewares: Middleware[] = [
  usersApi.middleware,
  calendarEventsApi.middleware,
];

export const store = configureStore({
  reducer: combineReducers({
    [usersApi.reducerPath]: usersApi.reducer,
    [calendarEventsApi.reducerPath]: calendarEventsApi.reducer,
  }),
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(...apiMiddlewares),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;