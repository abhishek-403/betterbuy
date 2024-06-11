//@ts-nocheck
import {  createSlice } from "@reduxjs/toolkit";


const appConfigSlice = createSlice({
  name: "appConfig",
  initialState: {
    isLoading: false,
    toastData: {},
    heroProducts: [],
  },
  reducers: {
    setLoader: (state, action) => {
      state.isLoading = action.payload;
    },
    showToast: (state, action) => {
      state.toastData = action.payload;
    },
  },
 
});

export default appConfigSlice.reducer;
export const { setLoader, showToast } = appConfigSlice.actions;
