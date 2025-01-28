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
} from "../Slice/ActivitiesSlice";
import { Activity } from "../../app/models/activity";

const selectActivityById = (
  state: { activities: { activities: Activity[] } },
  id: string
): Activity | undefined => {
  return state?.activities.activities.find(
    (activity: Activity) => activity.id === id
  );
};

function* fetchActivitiesSaga() {
  try {
    const response: Activity[] = yield call(agent.Activities.list);
    yield put(fetchActivitiesSuccess(response));
  } catch (error: unknown) {
    yield put(fetchActivitiesFailure(error || "Failed to fetch data."));
  }
}

function* fetchActivityByIdSaga(
  action: ReturnType<typeof loadActivityRequest>
) {
  if (!action.payload) {
    const emptyActivity: Activity = {
      id: "",
      title: "",
      category: "",
      description: "",
      date: null,
      city: "",
      venue: "",
    };
    yield put(loadActivitySuccess(emptyActivity));
    return;
  }

  const activity: Activity | undefined = yield select(
    selectActivityById,
    action.payload
  );
  if (activity) {
    yield put(loadActivitySuccess(activity));
  } else {
    try {
      const response: Activity = yield call(
        agent.Activities.details,
        action.payload
      );
      yield put(loadActivitySuccess(response));
    } catch (error: unknown) {
      yield put(loadActivityFailure(error || "failed to fetch activity."));
    }
  }
}
function* createActivitySaga(action: ReturnType<typeof createActivityRequest>) {
  const activity = action.payload;
  try {
    yield call(agent.Activities.create, activity);
    yield put(createActivitySuccess(activity));
  } catch (error: unknown) {
    yield put(createActivityFailure(error || "Failed to create activity."));
  }
}

function* updateActivitySaga(action: ReturnType<typeof updateActivityRequest>) {
  try {
    yield call(agent.Activities.update, action.payload);
    yield put(updateActivitySuccess(action.payload));
  } catch (error: unknown) {
    yield put(updateActivityFailure(error || "Failed to update activity."));
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

export function* activitiesSaga() {
  yield takeEvery(fetchActivitiesRequest.type, fetchActivitiesSaga);
  yield takeEvery(createActivityRequest.type, createActivitySaga);
  yield takeEvery(updateActivityRequest.type, updateActivitySaga);
  yield takeEvery(deleteActivityRequest.type, deleteActivitySaga);
  yield takeEvery(loadActivityRequest.type, fetchActivityByIdSaga);
}
