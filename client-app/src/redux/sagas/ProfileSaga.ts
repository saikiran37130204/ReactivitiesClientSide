import { call, put, select, takeEvery } from "redux-saga/effects";
import agent from "../../app/api/agent";
import { Photo, Profile } from "../../app/models/profile";
import {
  deletePhotoFailure,
  deletePhotoRequest,
  deletePhotoSuccess,
  loadProfileFailure,
  loadProfileRequest,
  loadProfileSuccess,
  setMainPhotoFailure,
  setMainPhotoRequest,
  setMainPhotoSuccess,
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

const selectUser = (state: RootState) => state.users.user;

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
    if(action.payload.displayName && action.payload.displayName!==user?.displayName){
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

export function* profileSaga() {
  yield takeEvery(loadProfileRequest.type, loadProfileSaga);
  yield takeEvery(uploadPhotoRequest.type, uploadPhotoSaga);
  yield takeEvery(setMainPhotoRequest.type, setMainPhotoSaga);
  yield takeEvery(deletePhotoRequest.type, deletePhotoSaga);
  yield takeEvery(updateProfileRequest.type, updateProfileSaga);
}
