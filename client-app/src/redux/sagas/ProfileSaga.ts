import { call, put, select, takeEvery } from "redux-saga/effects";
import agent from "../../app/api/agent";
import { Photo, Profile, UserActivity } from "../../app/models/profile";
import {
  deletePhotoFailure,
  deletePhotoRequest,
  deletePhotoSuccess,
  loadFollowingsFailure,
  loadFollowingsRequest,
  loadFollowingsSuccess,
  loadProfileFailure,
  loadProfileRequest,
  loadProfileSuccess,
  loadUserActivitiesFailure,
  loadUserActivitiesRequest,
  loadUserActivitiesSuccess,
  setActiveTabRequest,
  setActiveTabSuccess,
  setFollowingsEmpty,
  setMainPhotoFailure,
  setMainPhotoRequest,
  setMainPhotoSuccess,
  updateFollowingFailure,
  updateFollowingRequest,
  updateFollowingSuccess,
  updateProfileFailure,
  updateProfileRequest,
  updateProfileSuccess,
  uploadPhotoFailure,
  uploadPhotoRequest,
  uploadPhotoSuccess,
} from "../Slice/profileSlice";
import { setDisplayName, setImage } from "../Slice/usersSlice";
import { RootState } from "../store";
import { User } from "../../app/models/User";
import { AxiosError, AxiosResponse } from "axios";
import { updateAttendeeFollowing } from "../Slice/ActivitiesSlice";

const selectUser = (state: RootState) => state.users.user;
const selectProfile = (state: RootState) => state.profile.profile;

function* loadProfileSaga(action: ReturnType<typeof loadProfileRequest>) {
  try {
    const profile: Profile = yield call(agent.Profiles.get, action.payload);
    console.log("profiles:", profile);
    yield put(loadProfileSuccess(profile));
  } catch (error: unknown) {
    yield put(loadProfileFailure(error || "failed to load profile"));
  }
}

function* uploadPhotoSaga(action: ReturnType<typeof uploadPhotoRequest>) {
  try {
    const base64File = action.payload; // Get the Base64 string from the action
    const blob = base64ToBlob(base64File); // Convert Base64 back to a Blob

    const response: AxiosResponse<Photo> = yield call(
      agent.Profiles.uploadPhoto,
      blob
    );
    console.log("Upload response:", response);

    const user: User | null | undefined = yield select(selectUser);
    yield put(uploadPhotoSuccess({ photo: response.data, user }));

    if (response.data.isMain && user) {
      yield put(setImage(response.data.url)); // Update the user's main image
    }
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error("Upload failed:", error.message);
      yield put(uploadPhotoFailure(error.message));
    } else {
      console.error("Upload failed:", error);
      yield put(uploadPhotoFailure("Failed to upload photo"));
    }
  }
}

// Helper function to convert Base64 to Blob
const base64ToBlob = (base64: string): Blob => {
  const arr = base64.split(",");
  const mime = arr[0].match(/:(.*?);/)![1]; // Extract the MIME type
  const bstr = atob(arr[1]); // Decode the Base64 string
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime }); // Create a Blob from the Uint8Array
};

function* setMainPhotoSaga(action: ReturnType<typeof setMainPhotoRequest>) {
  try {
    yield call(agent.Profiles.setMainPhoto, action.payload.id);
    yield put(setMainPhotoSuccess(action.payload));
    yield put(setImage(action.payload.url));
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error("failed to set main photo: ", error.message);
      yield put(setMainPhotoFailure(error.message));
    } else {
      console.error("failed to set main photo: ", error);
      yield put(setMainPhotoFailure("Failed to set main photo"));
    }
  }
}

function* deletePhotoSaga(action: ReturnType<typeof deletePhotoRequest>) {
  try {
    yield call(agent.Profiles.deletePhoto, action.payload.id);
    yield put(deletePhotoSuccess(action.payload));
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error("failed to delete photo: ", error.message);
      yield put(deletePhotoFailure(error.message));
    } else {
      console.error("failed to delete photo: ", error);
      yield put(deletePhotoFailure("failed to delete photo"));
    }
  }
}
function* updateProfileSaga(action: ReturnType<typeof updateProfileRequest>) {
  try {
    yield call(agent.Profiles.updateProfile, action.payload);
    yield put(updateProfileSuccess(action.payload));
    const user: User | null | undefined = yield select(selectUser);
    if (
      action.payload.displayName &&
      action.payload.displayName !== user?.displayName
    ) {
      yield put(setDisplayName(action.payload.displayName));
    }
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error("failed to update profile: ", error.message);
      yield put(updateProfileFailure(error.message));
    } else {
      console.error("failed to update profile: ", error);
      yield put(updateProfileFailure("failed to update profile"));
    }
  }
}
function* updateFollowingSaga(
  action: ReturnType<typeof updateFollowingRequest>
) {
  try {
    yield call(agent.Profiles.updateFollowing, action.payload.username);
    yield put(updateAttendeeFollowing(action.payload.username));
    const user: User = yield select(selectUser);
    yield put(
      updateFollowingSuccess({
        username: user.username,
        following: action.payload.following,
        actionUsername: action.payload.username,
      })
    );
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error("failed to update Following: ", error.message);
      yield put(updateFollowingFailure(error.message));
    } else {
      console.error("failed to update Following: ", error);
      yield put(updateFollowingFailure("failed to update Following"));
    }
  }
}

function* loadFollowingsSaga(action: ReturnType<typeof loadFollowingsRequest>) {
  try {
    const profile: Profile | null = yield select(selectProfile);
    const followings: Profile[] = yield call(
      agent.Profiles.listFollowings,
      profile!.username,
      action.payload
    );
    yield put(loadFollowingsSuccess(followings));
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error("failed to load Following: ", error.message);
      yield put(loadFollowingsFailure(error.message));
    } else {
      console.error("failed to load Following: ", error);
      yield put(loadFollowingsFailure("failed to load Following"));
    }
  }
}
function* setActiveTabSaga(action: ReturnType<typeof setActiveTabRequest>) {
  try {
    const activeTab = action.payload;
    if (activeTab === 3 || activeTab === 4) {
      const predicate = activeTab === 3 ? "followers" : "following";
      yield put(loadFollowingsRequest(predicate));
    } else {
      yield put(setFollowingsEmpty());
    }
    yield put(setActiveTabSuccess(action.payload));
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error("failed to set active tab: ", error.message);
      yield put(loadFollowingsFailure(error.message));
    } else {
      console.error("failed to set active tab: ", error);
      yield put(loadFollowingsFailure("failed to set active tab"));
    }
  }
}

function* loadUserActivitiesSaga(
  action: ReturnType<typeof loadUserActivitiesRequest>
) {
  const { username, predicate } = action.payload;
  try {
    const activities: UserActivity[] = yield call(function (
      obj: typeof agent.Profiles
    ) {
      return obj.listActivities(username, predicate as string);
    },
    agent.Profiles);
    console.log("event activities", activities);
    yield put(loadUserActivitiesSuccess(activities));
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error("failed to load activities: ", error.message);
      yield put(loadUserActivitiesFailure(error.message));
    } else {
      console.error("failed to load activities: ", error);
      yield put(loadUserActivitiesFailure("failed to load user activities"));
    }
  }
}

export function* profileSaga() {
  yield takeEvery(loadProfileRequest.type, loadProfileSaga);
  yield takeEvery(uploadPhotoRequest.type, uploadPhotoSaga);
  yield takeEvery(setMainPhotoRequest.type, setMainPhotoSaga);
  yield takeEvery(deletePhotoRequest.type, deletePhotoSaga);
  yield takeEvery(updateProfileRequest.type, updateProfileSaga);
  yield takeEvery(updateFollowingRequest.type, updateFollowingSaga);
  yield takeEvery(loadFollowingsRequest.type, loadFollowingsSaga);
  yield takeEvery(setActiveTabRequest.type, setActiveTabSaga);
  yield takeEvery(loadUserActivitiesRequest.type, loadUserActivitiesSaga);
}
