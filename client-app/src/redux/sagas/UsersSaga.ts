import { call, put, takeEvery, takeLatest } from "redux-saga/effects";
import agent from "../../app/api/agent";
import {
  FacebookLoginFailure,
  facebookLoginRequest,
  facebookLoginSuccess,
  getUser,
  getUserFailure,
  getUserRequest,
  loginFailure,
  loginRequest,
  loginSuccess,
  registerUserFailure,
  registerUserRequest,
  registerUserSuccess,
} from "../Slice/usersSlice";
import { User } from "../../app/models/User";
import axios from "axios";
import store from "../store";
import { router } from "../../app/router/Routes";

function* UserLoginSaga(action: ReturnType<typeof loginRequest>) {
  try {
    console.log("Attempting login with payload:", action.payload);
    const user: User = yield call(agent.Account.login, action.payload);
    console.log("usersSaga", user);
    yield put(loginSuccess(user));
    yield router.navigate("/activities");
  } catch (error: unknown) {
    let errorMessage = "Invalid email or password";
    if (axios.isAxiosError(error)) {
      errorMessage =
        error.response?.data?.message || error.message || errorMessage;
    }
    yield put(loginFailure(errorMessage));
  }
}
function* fetchUser() {
  const token = store.getState().users.token;
  if (!token) {
    console.log("No token found, skipping fetchUser");
    return;
  }
  try {
    const user: User = yield call(agent.Account.current); // Fetch full user from backend
    localStorage.setItem("user", JSON.stringify(user)); // Store the full user object
    yield put(getUser(user));
  } catch (error: unknown) {
    let errorMessage = "Failed to fetch user data.";
    if (axios.isAxiosError(error)) {
      errorMessage =
        error.response?.data?.message || error.message || errorMessage;
    }
    yield put(getUserFailure(errorMessage));
  }
}

function* UserRegistrationSaga(action: ReturnType<typeof registerUserRequest>) {
  try {
    console.log("Attempting login with payload:", action.payload);
    const user: User = yield call(agent.Account.register, action.payload);
    yield put(registerUserSuccess(user));
    yield router.navigate("/activities");
  } catch (error: unknown) {
    yield put(registerUserFailure(error));
  }
}

function* FacebookLoginSaga(action:ReturnType<typeof facebookLoginRequest>){
try{
  const accessToken=action.payload;
const user:User=yield call(agent.Account.fbLogin,accessToken);
yield put(facebookLoginSuccess(user));
}catch(error:string|unknown){
  yield put(FacebookLoginFailure(error));
}
}

export function* UsersSaga() {
  yield takeLatest(getUserRequest.type, fetchUser);
  yield takeEvery(facebookLoginRequest.type,FacebookLoginSaga)
  yield takeEvery(loginRequest.type, UserLoginSaga);
  yield takeEvery(registerUserRequest.type, UserRegistrationSaga);
}
