import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User, UserFormValues } from "../../app/models/User";
import { router } from "../../app/router/Routes";

export interface UsersState {
  user: User | null | undefined;
  userFormValues: UserFormValues | undefined;
  isLoggedIn: boolean;
  error?: string | unknown | null;
  loading: boolean;
  token: string | null | undefined;
  appLoaded: boolean;
  open: boolean;
  body: "login" | "register" | null;
  justLoggedIn: boolean;
  fbLoading: boolean;
}

const initialState: UsersState = {
  user: null,
  userFormValues: undefined,
  isLoggedIn: false,
  error: null,
  loading: false,
  token: localStorage.getItem("jwt"), // Retrieve token from localStorage
  appLoaded: false,
  open: false,
  body: null,
  justLoggedIn: false,
  fbLoading: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    restoreUser(state) {
      const token = state.token;
      const storedUser = localStorage.getItem("user"); // Retrieve full user object

      if (token && storedUser) {
        state.user = JSON.parse(storedUser); // Use full user object
        state.isLoggedIn = !!state.user;
        state.error = null;
      } else {
        state.user = null;
        state.isLoggedIn = false;
        localStorage.removeItem("jwt");
        localStorage.removeItem("user"); // Ensure user data is cleared
      }
    },
    loginRequest(state, action: PayloadAction<UserFormValues>) {
      state.userFormValues = action.payload;
      state.loading = true;
      state.error = null;
      // state.appLoaded=false;
    },
    loginSuccess(state, action: PayloadAction<User>) {
      state.user = action.payload;
      const token = action.payload.token;
      if (token) {
        state.token = token;
        localStorage.setItem("jwt", token);
        localStorage.setItem("user", JSON.stringify(action.payload)); // Store full user
      }
      state.isLoggedIn = true;
      state.justLoggedIn = true;
      state.loading = false;
      state.open = false;
      state.body = null;
      //state.appLoaded=true;
    },
    loginFailure(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
      state.loading = false;
    },
    registerUserRequest(state, action: PayloadAction<UserFormValues>) {
      state.userFormValues = action.payload;
    },
    registerUserSuccess(state, action: PayloadAction<User>) {
      state.user = action.payload;
      const token = action.payload.token;
      if (token) {
        state.token = token;
        localStorage.setItem("jwt", token); // Save token in localStorage
      }
      state.open = false;
      state.body = null;
    },
    registerUserFailure(state, action: PayloadAction<string | unknown>) {
      state.error = action.payload;
    },
    setAppLoaded(state) {
      state.appLoaded = true;
      state.error = null;
    },
    logout(state) {
      state.token = undefined;
      state.user = null;
      state.error = null;
      state.isLoggedIn = false;
      localStorage.removeItem("jwt");
      router.navigate("/");
    },
    getUserRequest(state) {
      state.error = null;
    },
    getUser(state, action: PayloadAction<User | null>) {
      state.user = action.payload;
      state.isLoggedIn = true;
      state.error = null;
    },
    getUserFailure(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
      state.isLoggedIn = false;
    },
    openModel(state, action: PayloadAction<"login" | "register">) {
      state.open = true;
      state.body = action.payload;
    },
    closeModel(state) {
      state.open = false;
      state.body = null;
    },
    setImage(state, action: PayloadAction<string>) {
      if (state.user) {
        state.user.image = action.payload;
      }
    },
    setDisplayName(state, action: PayloadAction<string | undefined>) {
      if (state.user) {
        state.user.displayName = action.payload;
      }
    },

    resetJustLoggedIn(state) {
      state.justLoggedIn = false;
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    facebookLoginRequest(state, _action: PayloadAction<string>) {
      state.fbLoading = true;
    },
    facebookLoginSuccess(state, action: PayloadAction<User>) {
      const user=action.payload;
      state.user = user;
      state.token=user.token;
      state.fbLoading = false;
    },
    FacebookLoginFailure(state, action: PayloadAction<string | unknown>) {
      state.error = action.payload;
      state.fbLoading = false;
    },
  },
});

export const {
  restoreUser,
  loginRequest,
  loginSuccess,
  loginFailure,
  setAppLoaded,
  logout,
  getUser,
  getUserFailure,
  getUserRequest,
  openModel,
  closeModel,
  registerUserFailure,
  registerUserRequest,
  registerUserSuccess,
  setImage,
  setDisplayName,
  resetJustLoggedIn,
  facebookLoginRequest,
  facebookLoginSuccess,
  FacebookLoginFailure,
} = userSlice.actions;

export default userSlice.reducer;
