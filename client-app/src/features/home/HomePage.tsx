import { useSelector } from "react-redux";
import { Container, Header, Segment, Image, Button } from "semantic-ui-react";
import { RootState } from "../../redux/store";
import { useDispatch } from "react-redux";
import { openModel } from "../../redux/Slice/usersSlice";
import { Link } from "react-router-dom";

export default function HomePage() {
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((state: RootState) => state.users);

  const handleLoginOnClick = () => {
    dispatch(openModel("login"));
  };

  const handleRegisterOnClick = () => {
    dispatch(openModel("register"));
  };

  return (
    <Segment inverted textAlign="center" vertical className="masthead">
      <Container text>
        <Header as="h1" inverted>
          <Image
            size="massive"
            src="/Asserts/logo.png"
            alt="logo"
            style={{ marginBottom: 12 }}
          />
          Reactivities
        </Header>
        {isLoggedIn ? (
          <>
            <Header as="h2" inverted content="Welcome to Reactivities" />
            <Button as={Link} to="/activities" size="huge" inverted>
              Go to Activities!
            </Button>
          </>
        ) : (
          <>
            <Button onClick={handleLoginOnClick} size="huge" inverted>
              Login!
            </Button>
            <Button onClick={handleRegisterOnClick} size="huge" inverted>
              Register
            </Button>
          </>
        )}
      </Container>
    </Segment>
  );
}