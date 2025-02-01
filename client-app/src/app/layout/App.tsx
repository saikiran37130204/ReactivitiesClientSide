import { Container } from "semantic-ui-react";
import NavBar from "./NavBar";
import { Outlet, useLocation } from "react-router-dom";
import HomePage from "../../features/home/HomePage";
import { ToastContainer } from "react-toastify";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import {
  getUserRequest,
  restoreUser,
  setAppLoaded,
} from "../../redux/Slice/usersSlice";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import LoadingComponent from "./LoadingComponent";
import ModalContainer from "../common/modals/ModalContainer";

function App() {
  const location = useLocation();
  const dispatch = useDispatch();
  const { token, appLoaded } = useSelector((state: RootState) => state.users);
  useEffect(() => {
    if (token) {
      dispatch(restoreUser());
      dispatch(getUserRequest());
      dispatch(setAppLoaded());
    } else {
      dispatch(setAppLoaded());
    }
  }, [dispatch, token]);

  if (!appLoaded) return <LoadingComponent content="Loading app..." />;

  return (
    <>
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
export default App;
