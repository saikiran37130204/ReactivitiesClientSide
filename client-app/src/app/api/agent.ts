import axios, { AxiosError, AxiosResponse } from "axios";
import { Activity, ActivityFormValues } from "../models/activity";
import ErrorHandler from "./errorHandler";
import { User, UserFormValues } from "../models/User";
import store from "../../redux/store";
import { Photo, Profile } from "../models/profile";

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
  del: <T>(url: string) => axios.delete<T>(url).then(responseBody),
};

const Activities = {
  list: () => requests.get<Activity[]>("/activities"),
  details: (id: string) => requests.get<Activity>(`/activities/${id}`),
  create: (activity: ActivityFormValues) =>
    axios.post<void>(`/activities`, activity),
  update: (acivity: ActivityFormValues) =>
    axios.put<void>(`/activities/${acivity.id}`, acivity),
  delete: (id: string) => requests.del<void>(`/activities/${id}`),
  attend: (id: string) => requests.post<void>(`/activities/${id}/attend`, {}),
};

const Account = {
  current: () => requests.get<User>("/account"),
  login: (user: UserFormValues) => requests.post<User>("/account/login", user),
  register: (user: UserFormValues) =>
    requests.post<User>("/account/register", user),
};

const Profiles = {
  get: (username: string) => requests.get<Profile>(`/profiles/${username}`),
  uploadPhoto: (blob: Blob) => {
    const formData = new FormData();
    formData.append("file", blob, "uploaded-image"); // Append the Blob to FormData

    return axios.post<Photo>("/photos", formData, {
      headers: {
        "Content-Type": "multipart/form-data", // Set the correct Content-Type
      },
    });
  },
  setMainPhoto:(id:string)=>requests.post(`/photos/${id}/setMain`,{}),
  deletePhoto:(id:string)=>requests.del(`/photos/${id}`)
};

const agent = {
  Activities,
  Account,
  Profiles,
};

export default agent;
