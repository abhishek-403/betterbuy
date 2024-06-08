import { configureStore } from "@reduxjs/toolkit";
import appConfigReducer from "./slices/appConfiigSlice";
export default configureStore({
  reducer: {
    appConfigReducer,
  },
});
