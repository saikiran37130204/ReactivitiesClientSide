import axios, { AxiosError, AxiosResponse } from "axios";
import { Activity } from "../models/activity";
import ErrorHandler from "./errorHandler";
import { User, UserFormValues } from "../models/User";
import store from "../../redux/store";

//import { setServerError } from "../../redux/Slice/ErrorSlice";

const sleep = (delay: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
};

axios.defaults.baseURL = "http://localhost:5000/api";

axios.interceptors.request.use((config) => {
  const token = store.getState().users.token;

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    delete config.headers.Authorization;
  }
  return config;
});

axios.interceptors.response.use(
  async (response) => {
    await sleep(1000);
    return response;
  },
  (error: AxiosError) => {
    ErrorHandler(error); // Use the custom hook here
    // Call the error handling logic
    return Promise.reject(error);
  }
);

const responseBody = <T>(response: AxiosResponse<T>) => response.data;

const requests = {
  get: <T>(url: string) => axios.get<T>(url).then(responseBody),
  post: <T>(url: string, body: {}) =>
    axios.post<T>(url, body).then(responseBody),
  put: <T>(url: string, body: {}) => axios.put<T>(url, body).then(responseBody),
  Del: <T>(url: string) => axios.delete<T>(url).then(responseBody),
};

const Activities = {
  list: () => requests.get<Activity[]>("/activities"),
  details: (id: string) => requests.get<Activity>(`/activities/${id}`),
  create: (activity: Activity) => axios.post<void>(`/activities`, activity),
  update: (acivity: Activity) =>
    axios.put<void>(`/activities/${acivity.id}`, acivity),
  delete: (id: string) => axios.delete<void>(`/activities/${id}`),
};

const Account = {
  current: () => requests.get<User>("/account"),
  login: (user: UserFormValues) => requests.post<User>("/account/login", user),
  register: (user: UserFormValues) =>
    requests.post<User>("/account/register", user),
};
const agent = {
  Activities,
  Account,
};

export default agent;
