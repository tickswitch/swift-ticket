// middleware.ts
import { Middleware } from "@reduxjs/toolkit";

export const localStorageMiddleware: Middleware = (store) => (next) => (action) => {
  const result = next(action);
  const state = store.getState();
  // Exclude ticket_file when saving to localStorage
  const stateToPersist = {
    ...state,
    sellTicket: {
      ...state.sellTicket,
      data: { ...state.sellTicket.data, ticket_file: undefined },
    },
  };
  localStorage.setItem("reduxState", JSON.stringify(stateToPersist));
  return result;
};