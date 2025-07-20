import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface LanguageState {
  current: "en" | "lt";
}

const initialState: LanguageState = {
  current: "en",
};

const languageSlice = createSlice({
  name: "language",
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<"en" | "lt">) => {
      state.current = action.payload;
      // Store in localStorage for persistence
      if (typeof window !== "undefined") {
        localStorage.setItem("language", action.payload);
      }
    },
    initializeLanguage: (state) => {
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("language") as "en" | "lt";
        if (stored && (stored === "en" || stored === "lt")) {
          state.current = stored;
        }
      }
    },
  },
});

export const { setLanguage, initializeLanguage } = languageSlice.actions;
export default languageSlice.reducer;
