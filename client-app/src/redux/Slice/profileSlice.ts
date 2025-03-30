import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Photo, Profile, UserActivity } from "../../app/models/profile";
import { User } from "../../app/models/User";

export interface IProfile {
  profile: Profile | null;
  loadingProfile: boolean;
  error: string | null | unknown | undefined;
  username: string | undefined;
  uploading: boolean;
  loading: boolean;
  followings: Profile[];
  loadingFollowings: boolean;
  activeTab: number;
  UserActivities:UserActivity[];
  loadingActivities:boolean;
}

const initialState: IProfile = {
  profile: null,
  loadingProfile: false,
  error: null,
  username: "",
  uploading: false,
  loading: false,
  followings: [],
  loadingFollowings: false,
  activeTab: 0,
  UserActivities:[],
  loadingActivities:false
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

    updateFollowingRequest(
      state,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      _: PayloadAction<{ username: string; following: boolean }>
    ) {
      state.loading = true;
    },
    updateFollowingSuccess(
      state,
      action: PayloadAction<{
        username: string;
        following: boolean;
        actionUsername: string;
      }>
    ) {
      const { username, following, actionUsername } = action.payload;
      
      if (
        state.profile &&
        state.profile.username !== username &&
        state.profile.username === actionUsername
      ) {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        following
          ? state.profile.followersCount++
          : state.profile.followersCount--;
        state.profile.following = !state.profile.following;
      }
      if (state.profile && state.profile.username === username) {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        following
          ? state.profile.followingCount++
          : state.profile.followingCount--;
      }

      state.followings.forEach((profile) => {
    
        if (profile.username === actionUsername) {
          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          profile.following
            ? profile.followersCount--
            : profile.followersCount++;
          profile.following = !profile.following;
        }
      });
      state.loading = false;
    },
    updateFollowingFailure(state, action: PayloadAction<string | unknown>) {
      state.error = action.payload;
      state.loading = false;
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    loadFollowingsRequest(state, _: PayloadAction<string>) {
      state.loadingFollowings = true;
    },
    loadFollowingsSuccess(state, action: PayloadAction<Profile[]>) {
      state.followings = action.payload;
      state.loadingFollowings = false;
    },
    loadFollowingsFailure(state, action: PayloadAction<string | unknown>) {
      state.error = action.payload;
      state.loadingFollowings = false;
    },
    setActiveTabRequest(state, action: PayloadAction<number>) {
      state.activeTab = action.payload;
    },
    setActiveTabSuccess(state, action: PayloadAction<number>) {
      state.activeTab = action.payload;
    },
    setActiveTabFailure(state, action: PayloadAction<string | unknown>) {
      state.error = action.payload;
    },
    setFollowingsEmpty(state) {
      state.followings = [];
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    loadUserActivitiesRequest(state,_:PayloadAction<{username:string,predicate?:string}>){
      state.loadingActivities=true;
    },
    loadUserActivitiesSuccess(state,action:PayloadAction<UserActivity[]>){
      state.UserActivities=action.payload;
      state.loadingActivities=false;
    },
    loadUserActivitiesFailure(state,action:PayloadAction<string|unknown>){
      state.error=action.payload;
      state.loadingActivities=false;
    }
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
  updateFollowingRequest,
  updateFollowingSuccess,
  updateFollowingFailure,
  loadFollowingsRequest,
  loadFollowingsSuccess,
  loadFollowingsFailure,
  setActiveTabRequest,
  setActiveTabSuccess,
  setActiveTabFailure,
  setFollowingsEmpty,
  loadUserActivitiesRequest,
  loadUserActivitiesSuccess,
  loadUserActivitiesFailure
} = profileSlice.actions;

export default profileSlice.reducer;
