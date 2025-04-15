import { configureStore, isPlain } from "@reduxjs/toolkit";
import createSagaMiddleware, { SagaMiddleware } from "redux-saga";
import rootSaga from "./sagas/rootSaga";
import activitiesReducer, { ActivityState } from "./Slice/ActivitiesSlice";
import commonErrorsReducer, { ErrorState } from "./Slice/ErrorSlice";
import usersReducer, { UsersState } from "./Slice/usersSlice";
import profileReducer, { IProfile } from "./Slice/profileSlice";
import commentReducer, { CommentState } from "./Slice/commentSlice";
//import { authMiddleware } from "./middleware/authMiddleware";

// Define your complete root state type
export interface RootState {
  activities: ActivityState;
  commonErrors: ErrorState;
  users: UsersState;
  profile: IProfile;
  comment: CommentState;
}

// Create saga middleware with proper typing
const sagaMiddleware: SagaMiddleware<object> = createSagaMiddleware();

export const store = configureStore({
  reducer: {
    activities: activitiesReducer,
    commonErrors: commonErrorsReducer,
    users: usersReducer,
    profile: profileReducer,
    comment: commentReducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({
      thunk: false,
      serializableCheck: {
        isSerializable: (value: unknown) =>
          value instanceof Date || isPlain(value),
      },
    }).concat(sagaMiddleware);
  },
});

// Run the root saga
sagaMiddleware.run(rootSaga);

export type AppDispatch = typeof store.dispatch;
export default store;
