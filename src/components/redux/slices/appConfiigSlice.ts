//@ts-nocheck
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const getHeroProduct = createAsyncThunk("/getheroproduct", async () => {
  try {
    const response = await axios.get("/api/getheroproducts");

    return Promise.resolve(response.data.result);
  } catch (e) {
    return Promise.reject(e);
  } finally {
  }
});

const appConfigSlice = createSlice({
  name: "appConfig",
  initialState: {
    isLoading: false,
    isHeroLoading: false,
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
  extraReducers: (builder) => {
    builder
      .addCase(getHeroProduct.pending, (state, action) => {
        state.isHeroLoading = true;
      })
      .addCase(getHeroProduct.fulfilled, (state, action) => {
        state.heroProducts = action.payload;
        state.isHeroLoading = false;
      })
      .addCase(getHeroProduct.rejected, (state, action) => {
        state.isHeroLoading = false;
      });
  },
});

export default appConfigSlice.reducer;
export const { setLoader, showToast } = appConfigSlice.actions;
