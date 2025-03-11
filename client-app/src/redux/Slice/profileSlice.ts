import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Photo, Profile } from "../../app/models/profile";
import { User } from "../../app/models/User";

interface IProfile {
  profile: Profile | null;
  loadingProfile: boolean;
  error: string | null | unknown | undefined;
  username: string | undefined;
  uploading: boolean;
  loading: boolean;
}

const initialState: IProfile = {
  profile: null,
  loadingProfile: false,
  error: null,
  username: "",
  uploading: false,
  loading: false,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    loadProfileRequest(state, action: PayloadAction<string>) {
      state.loadingProfile = true;
      state.username = action.payload;
    },
    loadProfileSuccess(state, action: PayloadAction<Profile | null>) {
      state.profile = action.payload;
      state.loadingProfile = false;
    },
    loadProfileFailure(state, action: PayloadAction<string | null | unknown>) {
      state.error = action.payload;
      state.loadingProfile = false;
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    uploadPhotoRequest(state, _: PayloadAction<string>) {
      state.uploading = true;
    },
    uploadPhotoSuccess(
      state,
      action: PayloadAction<{ photo: Photo; user: User | null | undefined }>
    ) {
      const photo = action.payload.photo;
      const user = action.payload.user;
      if (state.profile) {
        state.profile = {
          ...state.profile,
          photos: [...(state.profile.photos || []), photo],
        };
        if (photo.isMain && user) {
          state.profile.image = photo.url;
        }
      }
      state.uploading = false;
    },
    uploadPhotoFailure(state, action: PayloadAction<string | null | unknown>) {
      state.error = action.payload;
      state.uploading = false;
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setMainPhotoRequest(state, _: PayloadAction<Photo>) {
      state.loading = true;
    },
    setMainPhotoSuccess(state, photo: PayloadAction<Photo>) {
      if (state.profile && state.profile.photos) {
        state.profile.photos.find((p) => p.isMain)!.isMain = false;
        state.profile.photos.find((p) => p.id == photo.payload.id)!.isMain =
          true;
        state.profile.image = photo.payload.url;
        state.loading = false;
      }
    },
    setMainPhotoFailure(state, action: PayloadAction<string | null | unknown>) {
      state.error = action.payload;
      state.loading = false;
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    deletePhotoRequest(state, _: PayloadAction<Photo>) {
      state.loading = true;
    },
    deletePhotoSuccess(state, action: PayloadAction<Photo>) {
      if (state.profile) {
        state.profile.photos = state.profile.photos?.filter(
          (p) => p.id !== action.payload.id
        );
        state.loading = false;
      }
    },
    deletePhotoFailure(state, action: PayloadAction<string | null | unknown>) {
      state.error = action.payload;
      state.loading = false;
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    updateProfileRequest(state, _: PayloadAction<Partial<Profile>>) {
      state.loading = true;
    },
    updateProfileSuccess(state, action: PayloadAction<Partial<Profile>>) {
      state.profile = { ...state.profile, ...(action.payload as Profile) };
      state.loading = false;
    },
    updateProfileFailure(
      state,
      action: PayloadAction<string | null | unknown>
    ) {
      state.error = action.payload;
    },
  },
});

export const {
  loadProfileRequest,
  loadProfileSuccess,
  loadProfileFailure,
  uploadPhotoRequest,
  uploadPhotoSuccess,
  uploadPhotoFailure,
  setMainPhotoRequest,
  setMainPhotoSuccess,
  setMainPhotoFailure,
  deletePhotoRequest,
  deletePhotoSuccess,
  deletePhotoFailure,
  updateProfileRequest,
  updateProfileSuccess,
  updateProfileFailure,
} = profileSlice.actions;

export default profileSlice.reducer;
