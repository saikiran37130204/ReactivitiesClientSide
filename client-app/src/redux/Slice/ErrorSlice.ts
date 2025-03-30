import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ServerError } from "../../app/models/serverError";

export interface ErrorState {
  error: ServerError | null;
}

const initialState: ErrorState = {
  error: null,
};

const errorSlice = createSlice({
  name: "commonErrors",
  initialState,
  reducers: {
    setServerError(state, action: PayloadAction<ServerError>) {
      console.log("action data", action.payload);
      state.error = action.payload;
    },
  },
});

export const { setServerError } = errorSlice.actions;

export default errorSlice.reducer;
