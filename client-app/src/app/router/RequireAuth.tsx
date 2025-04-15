import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function RequireAuth() {
  const { isLoggedIn } = useSelector((state: RootState) => state.users);
  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }
  return <Outlet />;
}