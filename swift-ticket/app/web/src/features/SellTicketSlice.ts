import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// File metadata type for storing in Redux
export interface FileMetadata {
  name: string;
  size: number;
  type: string;
  lastModified: number;
}

// The full ticket object type
export interface SellTicketData {
  ticketmaster_id?: string;
  event_title?: string;
  venue?: string;
  location?: string;
  start_date?: string;
  end_date?: string;
  time?: string;
  latitude?: number;
  longitude?: number;
  mapUrl?: string;
  imageUrl?: string;
  original_price?: number;
  price?: number;
  additional_info?: string;
  country_of_residence?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  bank_country?: string;
  account_holder_name?: string;
  phone_number?: string;
  bank_account_number?: string;
  // Store file metadata instead of actual files
  ticket_file_metadata?: FileMetadata[];
}

interface SellTicketState {
  data: SellTicketData;
}

const initialState: SellTicketState = {
  data: {},
};

// Load from localStorage if exists
const persistedState = (() => {
  try {
    const saved = localStorage.getItem("sellTicket");
    if (saved) {
      return JSON.parse(saved);
    }
    return initialState;
  } catch {
    return initialState;
  }
})();

const sellTicketSlice = createSlice({
  name: "sellTicket",
  initialState: persistedState,
  reducers: {
    updateData: (state, action: PayloadAction<Partial<SellTicketData>>) => {
      state.data = { ...state.data, ...action.payload };
      // Save to localStorage (now all data is serializable)
      localStorage.setItem("sellTicket", JSON.stringify(state));
    },
    resetData: (state) => {
      state.data = {};
      localStorage.removeItem("sellTicket");
      // Also clear the global file storage
      if (typeof window !== 'undefined') {
        delete window.uploadedTicketFiles;
      }
    },
  },
});

export const { updateData, resetData } = sellTicketSlice.actions;
export default sellTicketSlice.reducer;