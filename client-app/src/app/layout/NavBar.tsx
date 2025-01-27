import { Button, Container, Menu } from "semantic-ui-react";
import { NavLink } from "react-router-dom";
import { useDispatch } from "react-redux";
import { resetSelectedActivity } from "../../redux/Slice/ActivitiesSlice";

export default function NavBar() {
  const dispatch=useDispatch();

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
      </Container>
    </Menu>
  );
}
