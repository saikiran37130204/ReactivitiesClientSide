import { all } from "redux-saga/effects";
import { activitiesSaga } from "./ReactivitiesSaga";
import { ErrorActionsSaga } from "./ErrorSaga";
import { UsersSaga } from "./UsersSaga";

export default function* rootSaga() {
  yield all([activitiesSaga(),ErrorActionsSaga(),UsersSaga()]);
}
