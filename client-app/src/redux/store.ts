import { configureStore, isPlain } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import rootSaga from "./sagas/rootSaga";
import activities from "./Slice/ActivitiesSlice";
import commonErrors from "./Slice/ErrorSlice";
import users from "./Slice/usersSlice";

const sagaMiddleware = createSagaMiddleware();

const isSerializable = (value: unknown) => {
  return value instanceof Date || isPlain(value); // Treat Date objects as serializable
};

export const store = configureStore({
  reducer: {
    activities,
    commonErrors,
    users,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: false, // Disable thunk since you're using saga
      serializableCheck: {
        isSerializable,
      },
    }).concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
