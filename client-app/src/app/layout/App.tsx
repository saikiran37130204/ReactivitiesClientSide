import { Container } from "semantic-ui-react";
import NavBar from "./NavBar";
import { Outlet, ScrollRestoration, useLocation } from "react-router-dom";
import HomePage from "../../features/home/HomePage";
import { ToastContainer } from "react-toastify";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import {
  getUserRequest,
  resetJustLoggedIn,
  restoreUser,
} from "../../redux/Slice/usersSlice";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import ModalContainer from "../common/modals/ModalContainer";
import { router } from "../router/Routes";

export default function App() {
  const location = useLocation();
  const dispatch = useDispatch();
  const { token, justLoggedIn } = useSelector(
    (state: RootState) => state.users
  );

  useEffect(() => {
    if (token) {
      dispatch(restoreUser());
      dispatch(getUserRequest());
    }
  }, [dispatch, token]);

  useEffect(() => {
    if (justLoggedIn && location.pathname !== "/activities") {
      console.log("Just logged in, navigating to /activities");
      router.navigate("/activities").then(() => {
        dispatch(resetJustLoggedIn());
      });
    }
  }, [justLoggedIn, location.pathname, dispatch]);

  return (
    <>
      <ScrollRestoration />
      <ModalContainer />
      <ToastContainer position="bottom-right" hideProgressBar theme="colored" />
      {location.pathname === "/" ? (
        <HomePage />
      ) : (
        <>
          <NavBar />
          <Container style={{ marginTop: "7em" }}>
            <Outlet />
          </Container>
        </>
      )}
    </>
  );
}
