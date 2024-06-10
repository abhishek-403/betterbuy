//@ts-nocheck
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const getheroProducts = createAsyncThunk(
  "/heroproducts",
  async () => {
    try {
      // thunkAPI.dispatch(setSpinner(true));

      const response = await axios.get("/api/getheroproducts");
      
      return response.data;
    } catch (e) {
      console.log(e);

      return Promise.reject(e);
    } finally {
      // thunkAPI.dispatch(setSpinner(false));
    }
  }
);

const appConfigSlice = createSlice({
  name: "appConfig",
  initialState: {
    isLoading: false,
    toastData: {},
    heroProducts:[]
  },
  reducers: {
    setLoader: (state, action) => {
      state.isLoading = action.payload;
    },
    showToast: (state, action) => {
      state.toastData = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getheroProducts.fulfilled, (state, action) => {
      state.heroProducts = action.payload.response;
      
    });
  },
});

export default appConfigSlice.reducer;
export const { setLoader, showToast } = appConfigSlice.actions;
