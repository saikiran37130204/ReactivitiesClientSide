import { takeEvery, put } from "redux-saga/effects";
import { ServerError } from "../../app/models/serverError";
import { PayloadAction } from "@reduxjs/toolkit";
import { setServerError } from "../Slice/ErrorSlice";

// Simulate an API call that may fail
function* handleServerError(action: PayloadAction<ServerError>) {
  try {
    // Simulate API call or other async logic
    console.log("Handling server error:", action.payload);

    // Here you can add further logic to handle specific error types
    // For now, just dispatch the error to the state
    yield put(setServerError(action.payload));
  } catch (error) {
    // Handle any unexpected errors during the process
    console.error("Saga error handling failed", error);
    // Dispatch a generic error or handle accordingly
  }
}

export function* ErrorActionsSaga() {
  // Watch for the setServerError action and trigger the handler
  yield takeEvery(setServerError.type, handleServerError);
}
