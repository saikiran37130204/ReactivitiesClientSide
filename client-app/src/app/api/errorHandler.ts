import { store } from "../../redux/store"; // Import the store directly
import { setServerError } from "../../redux/Slice/ErrorSlice";
import { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { router } from "../router/Routes";

const ErrorHandler = (error: AxiosError) => {
  const { data, status,config } = error.response as AxiosResponse;

  switch (status) {
    case 400:
      if(config.method==='get' && Object.prototype.hasOwnProperty.call(data.errors, 'id')){
        router.navigate('/not-found');
      }
      if (data?.errors) {
        const modalStateErrors = [];
        for (const key in data.errors) {
          if (data.errors[key]) {
            modalStateErrors.push(data.errors[key]);
          }
        }
        throw modalStateErrors.flat();
      } else {
        toast.error(data);
      }
      break;
    case 401:
      toast.error("Unauthorized");
      break;
    case 403:
      toast.error("Forbidden");
      break;
    case 404:
      router.navigate("/not-found");
      break;
    case 500:
      store.dispatch(setServerError(data)); // Use the Redux store directly
      router.navigate("/server-error");
      break;
    default:
      break;
  }
};

export default ErrorHandler;
