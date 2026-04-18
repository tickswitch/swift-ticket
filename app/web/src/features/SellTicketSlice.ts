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
  originalFaceValue?: number;
  // Store file metadata instead of actual files
  ticket_file_metadata?: FileMetadata[];
}

interface SellTicketState {
  data: SellTicketData;
  uploadedFiles: File[];
}

const initialState: SellTicketState = {
  data: {},
  uploadedFiles: [],
};

// Load from localStorage if exists
const persistedState: SellTicketState = (() => {
  try {
    const saved = localStorage.getItem("sellTicket");
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        data: parsed.data ?? {},
        // Files cannot be serialised; always start empty on load
        uploadedFiles: [],
      };
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
      // Save to localStorage (only persist `data`, not uploadedFiles)
      localStorage.setItem(
        "sellTicket",
        JSON.stringify({ data: state.data })
      );
    },
    setUploadedFiles: (state, action: PayloadAction<File[]>) => {
      state.uploadedFiles = action.payload;
    },
    resetData: (state) => {
      state.data = {};
      state.uploadedFiles = [];
      localStorage.removeItem("sellTicket");
    },
  },
});

export const { updateData, setUploadedFiles, resetData } = sellTicketSlice.actions;
export default sellTicketSlice.reducer;
