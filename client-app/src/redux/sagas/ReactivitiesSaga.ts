import { call, put, select, takeEvery } from "redux-saga/effects";
import agent from "../../app/api/agent";
import {
  fetchActivitiesRequest,
  fetchActivitiesSuccess,
  fetchActivitiesFailure,
  createActivityRequest,
  createActivitySuccess,
  createActivityFailure,
  updateActivityRequest,
  updateActivitySuccess,
  updateActivityFailure,
  deleteActivityRequest,
  deleteActivitySuccess,
  deleteActivityFailure,
  loadActivityRequest,
  loadActivitySuccess,
  loadActivityFailure,
  updateAttendanceRequest,
  updateAttendanceFailure,
  updateAttendanceSuccess,
  cancelActivityToggleSuccess,
  cancelActivityToggleRequest,
  
} from "../Slice/ActivitiesSlice";
import { Activity, ActivityFormValues } from "../../app/models/activity";
import { User } from "../../app/models/User";
import { RootState } from "../store";
import { AxiosError } from "axios";

const selectActivityById = (
  state: { activities: { activities: Activity[] } },
  id: string
): Activity | undefined => {
  return state?.activities.activities.find(
    (activity: Activity) => activity.id === id
  );
};
const selectUser = (state: RootState) => state.users.user;
const selectedActivity = (state: RootState) =>
  state.activities.selectedActivity;

function* fetchActivitiesSaga() {
  try {
    const response: Activity[] = yield call(agent.Activities.list);

    const user: User | null = yield select(selectUser);

    yield put(fetchActivitiesSuccess({ activities: response, user }));
  } catch (error: unknown) {
    yield put(fetchActivitiesFailure(error || "Failed to fetch data."));
  }
}

function* fetchActivityByIdSaga(
  action: ReturnType<typeof loadActivityRequest>
) {
  // Get user from the Redux state using select
  const user: User | null = yield select(selectUser);

  // If no activity ID is passed, return an empty activity
  if (!action.payload) {
    const emptyActivity: Activity = {
      id: "",
      title: "",
      category: "",
      description: "",
      date: null,
      city: "",
      venue: "",
      hostUsername: "",
      isCancelled: false,
      isGoing: false,
      isHost: false,
      attendees: []
    };
    yield put(loadActivitySuccess({ activity: emptyActivity, user }));
    return;
  }

  // Check if the activity is already in the store
  const activity: Activity | undefined = yield select(
    selectActivityById,
    action.payload
  );

  // If activity found in the store, dispatch it
  if (activity) {
    yield put(loadActivitySuccess({ activity, user }));
  } else {
    // Fetch activity details from the API if not found in the store
    try {
      const response: Activity = yield call(
        agent.Activities.details,
        action.payload
      );
      yield put(loadActivitySuccess({ activity: response, user }));
    } catch (error: unknown) {
      yield put(loadActivityFailure(error || "failed to fetch activity."));
    }
  }
}

function* createActivitySaga(action: ReturnType<typeof createActivityRequest>) {
  const activity: ActivityFormValues = action.payload;
  const user: User | null = yield select(selectUser);

  try {
    yield call(agent.Activities.create, activity);
    yield put(createActivitySuccess({ activity, user }));
  } catch (error: unknown) {
    yield put(createActivityFailure(error || "Failed to create activity."));
  }
}

function* updateActivitySaga(action: ReturnType<typeof updateActivityRequest>) {
  try {
    const user: User | null = yield select(selectUser);
    yield call(agent.Activities.update, action.payload);
    const activity: ActivityFormValues = action.payload;
    yield put(updateActivitySuccess({ activityFormValues: activity, user }));
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to update activity.";
    const statusCode =
      error instanceof AxiosError ? error.response?.status : 500;
    yield put(updateActivityFailure({ message: errorMessage, statusCode }));
  }
}

function* deleteActivitySaga(action: ReturnType<typeof deleteActivityRequest>) {
  try {
    yield call(agent.Activities.delete, action.payload);
    yield put(deleteActivitySuccess(action.payload));
  } catch (error: unknown) {
    yield put(deleteActivityFailure(error || "Failed to delete activity."));
  }
}

function* updateAttendanceSaga() {
  try {
    const user: User | null = yield select(selectUser);
    const selectActivity: Activity = yield select(selectedActivity);
    yield call(agent.Activities.attend, selectActivity!.id);
    yield put(updateAttendanceSuccess(user));
  } catch (error: unknown) {
    yield put(updateAttendanceFailure(error || "Failed to update Attendance"));
  }
}

function* cancelActivityToggleSaga() {
  try {
    const selectActivity: Activity = yield select(selectedActivity);
    console.log("Toggling cancellation for activity:", selectActivity.id);
    yield call(agent.Activities.attend, selectActivity!.id);
    yield put(cancelActivityToggleSuccess());
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to update activity.";
    const statusCode =
      error instanceof AxiosError ? error.response?.status : 500;
    yield put(updateActivityFailure({ message: errorMessage, statusCode }));
  }
}


export function* activitiesSaga() {
  yield takeEvery(fetchActivitiesRequest.type, fetchActivitiesSaga);
  yield takeEvery(createActivityRequest.type, createActivitySaga);
  yield takeEvery(updateActivityRequest.type, updateActivitySaga);
  yield takeEvery(deleteActivityRequest.type, deleteActivitySaga);
  yield takeEvery(loadActivityRequest.type, fetchActivityByIdSaga);
  yield takeEvery(updateAttendanceRequest.type, updateAttendanceSaga);
  yield takeEvery(cancelActivityToggleRequest.type,cancelActivityToggleSaga);
}
