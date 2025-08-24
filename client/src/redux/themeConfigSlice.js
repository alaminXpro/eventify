// src/redux/themeConfigSlice.js
import { createSlice } from "@reduxjs/toolkit";

const themeConfigSlice = createSlice({
  name: "themeConfig",
  initialState: {
    pageTitle: "",
    rtlClass: "ltr",
  },
  reducers: {
    setPageTitle(state, action) {
      state.pageTitle = action.payload || "";
      // Optional: also update document.title for UX
      document.title = state.pageTitle
        ? `${state.pageTitle} · Eventify`
        : "Eventify";
    },
    setRtlClass(state, action) {
      state.rtlClass = action.payload === "rtl" ? "rtl" : "ltr";
    },
  },
});

export const { setPageTitle, setRtlClass } = themeConfigSlice.actions;
export default themeConfigSlice.reducer;
