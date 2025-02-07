import { Button, Container, Dropdown, Menu, Image } from "semantic-ui-react";
import { Link, NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { resetSelectedActivity } from "../../redux/Slice/ActivitiesSlice";
import { RootState } from "../../redux/store";
import { logout } from "../../redux/Slice/usersSlice";

export default function NavBar() {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.users);
  return (
    <Menu inverted fixed="top">
      <Container>
        <Menu.Item as={NavLink} to="/" header>
          <img
            src="/Asserts/logo.png"
            alt="logo"
            style={{ marginRight: "20px" }}
          />
          Reactivities
        </Menu.Item>
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

        {user && ( // Ensure user is logged in before showing the dropdown
          <Menu.Item position="right">
            <Image
              src={user.image || "/Asserts/user.png"}
              avatar
              spaced="right"
            />
            <Dropdown pointing="top left" text={user.displayName}>
              <Dropdown.Menu>
                <Dropdown.Item
                  as={Link}
                  to={`/profile/${user.username}`}
                  text="My Profile"
                  icon="user"
                />
                <Dropdown.Item
                  onClick={() => dispatch(logout())}
                  text="Logout"
                  icon="power"
                />
              </Dropdown.Menu>
            </Dropdown>
          </Menu.Item>
        )}
      </Container>
    </Menu>
  );
}
