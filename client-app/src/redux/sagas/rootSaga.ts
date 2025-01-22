import { all } from "redux-saga/effects";
import {activitiesSaga } from "./ReactivitiesSaga";

export default function* rootSaga() {
  yield all([activitiesSaga()]);
}