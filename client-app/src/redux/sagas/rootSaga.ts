import { all } from "redux-saga/effects";
import { activitiesSaga } from "./ReactivitiesSaga";
import { ErrorActionsSaga } from "./ErrorSaga";

export default function* rootSaga() {
  yield all([activitiesSaga()]);
  yield all([ErrorActionsSaga]);
}
