import { useSelector } from "react-redux";
import {
  Container,
  Header,
  Segment,
  Image,
  Button,
  Divider,
} from "semantic-ui-react";
import { RootState } from "../../redux/store";
import { useDispatch } from "react-redux";
import { facebookLoginRequest, openModel } from "../../redux/Slice/usersSlice";
import { Link } from "react-router-dom";
import FacebookLogin, {
  FailResponse,
  SuccessResponse,
} from "@greatsumini/react-facebook-login";

export default function HomePage() {
  const dispatch = useDispatch();
  const { isLoggedIn, fbLoading, user } = useSelector(
    (state: RootState) => state.users
  );

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
            src="/assets/logo.png"
            alt="logo"
            style={{ marginBottom: 12 }}
          />
          Reactivities
        </Header>
        {isLoggedIn ? (
          <>
            <Header
              as="h2"
              inverted
              content={`Welcome back ${user?.displayName}`}
            />
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
            <Divider horizontal inverted>
              Or
            </Divider>
            <FacebookLogin
              appId="653322761019976"
              onSuccess={(response: SuccessResponse) => {
                dispatch(facebookLoginRequest(response.accessToken));
                console.log("login success", response);
              }}
              onFail={(response: FailResponse) =>
                console.log("Login Failed!", response)
              }
              className={`ui button facebook huge inverted ${
                fbLoading && "loading"
              }`}
            />
          </>
        )}
      </Container>
    </Segment>
  );
}
