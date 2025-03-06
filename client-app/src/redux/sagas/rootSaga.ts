import { all } from "redux-saga/effects";
import { activitiesSaga } from "./ReactivitiesSaga";
import { ErrorActionsSaga } from "./ErrorSaga";
import { UsersSaga } from "./UsersSaga";
import { profileSaga } from "./ProfileSaga";

export default function* rootSaga() {
  yield all([activitiesSaga(), ErrorActionsSaga(), UsersSaga(), profileSaga()]);
}
