import { configureStore } from "@reduxjs/toolkit";
import { localStorageMiddleware } from "./middleware";
import StepperReducer from "../features/StepperSlice";
import sellTicketReducer from "../features/SellTicketSlice";

const store = configureStore({
  reducer: {
    stepper: StepperReducer,
    sellTicket: sellTicketReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredPaths: ["sellTicket.data.ticket_file"], // Ignore ticket_file for serialization checks
        ignoredActions: ["sellTicket/updateData"], // Ignore updateData action
      },
    }).concat(localStorageMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;