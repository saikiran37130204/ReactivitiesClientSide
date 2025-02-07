import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User, UserFormValues } from "../../app/models/User";
import { router } from "../../app/router/Routes";

interface UsersState {
  user: User | null | undefined;
  userFormValues: UserFormValues | undefined;
  isLoggedIn: boolean;
  error?: string | null | unknown | string[];
  loading: boolean;
  token: string | null | undefined;
  appLoaded: boolean;
  open: boolean;
  body: "login" | "register" | null;
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
      state.loading = false;
      state.open = false;
      state.body = null;
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
    registerUserFailure(state, action: PayloadAction<string | null | unknown>) {
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
      state.isLoggedIn = false;
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
} = userSlice.actions;

export default userSlice.reducer;
