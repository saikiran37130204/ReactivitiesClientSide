import { Button, Container, Dropdown, Menu, Image } from "semantic-ui-react";
import { Link, NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { resetSelectedActivity } from "../../redux/Slice/ActivitiesSlice";
import { RootState } from "../../redux/store";
import { logout } from "../../redux/Slice/usersSlice";
import { router } from "../router/Routes";

export default function NavBar() {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.users);

  const handleLogout = () => {
    dispatch(logout());
    router.navigate("/");
  };

  return (
    <Menu inverted fixed="top">
      <Container>
        <Menu.Item as={NavLink} to="/" header>
          <img
            src="/assets/logo.png"
            alt="logo"
            style={{ marginRight: "20px" }}
          />
          Reactivities
        </Menu.Item>

        {/* Protected routes - only show when logged in */}
        {user && (
          <>
            <Menu.Item as={NavLink} to="/activities" name="Activities" />
            <Menu.Item as={NavLink} to="/errors" name="Errors" />
            <Menu.Item>
              <Button
                as={NavLink}
                to="/createActivity"
                positive
                content="Create Activity"
                onClick={() => dispatch(resetSelectedActivity())}
              />
            </Menu.Item>
          </>
        )}

        {/* User dropdown or login button */}
        <Menu.Item position="right">
          {user ? (
            <>
              <Image
                src={user.image || "/assets/user.png"}
                avatar
                spaced="right"
              />
              <Dropdown pointing="top left" text={user.displayName}>
                <Dropdown.Menu>
                  <Dropdown.Item
                    as={Link}
                    to={`/profiles/${user.username}`}
                    text="My Profile"
                    icon="user"
                  />
                  <Dropdown.Item
                    onClick={handleLogout}
                    text="Logout"
                    icon="power"
                  />
                </Dropdown.Menu>
              </Dropdown>
            </>
          ) : (
            <Button as={NavLink} to="/login" inverted content="Login" />
          )}
        </Menu.Item>
      </Container>
    </Menu>
  );
}
