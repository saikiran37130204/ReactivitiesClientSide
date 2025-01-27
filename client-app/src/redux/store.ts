import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import rootSaga from "./sagas/rootSaga";
import activities from "./Slice/ActivitiesSlice";
import commonErrors from "./Slice/ErrorSlice"

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: {
    activities,
    commonErrors
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: false }).concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 

export default store;
