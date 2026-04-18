import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const TOTAL_STEPS = 9;

interface StepperState {
  currentStep: number;
  progress: number;
}
const initialState: StepperState = {
  currentStep: 1,
  progress: 15,
};

const calculateProgress = (step: number) =>
  Math.round(((step - 1) / (TOTAL_STEPS - 1)) * 100);

export const StepperSlice = createSlice({
  name: "stepper",
  initialState,
  reducers: {
    nextStep: (state) => {
      if (state.currentStep < TOTAL_STEPS) {
        state.currentStep += 1;
        state.progress = calculateProgress(state.currentStep);
      }
    },
    prevStep: (state) => {
      if (state.currentStep > 1) {
        state.currentStep -= 1;
        state.progress = calculateProgress(state.currentStep);
      }
    },
    setStep: (state, action: PayloadAction<number>) => {
      const step = action.payload;
      state.currentStep = step;
      state.progress = calculateProgress(step);
    },
  },
});

export const { nextStep, prevStep, setStep } = StepperSlice.actions;
export default StepperSlice.reducer;
