import { Form, Formik } from "formik";
import MyTextInput from "../../app/common/form/MyTextInput";
import { Button, Header, Label } from "semantic-ui-react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useDispatch } from "react-redux";
import { loginRequest } from "../../redux/Slice/usersSlice";
import { UserFormValues } from "../../app/models/User";

export default function LoginForm() {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state: RootState) => state.users);
  function handleLoginSubmit(values: UserFormValues) {
    if (values) {
      dispatch(loginRequest(values));
    }
  }

  return (
    <Formik
      initialValues={{ email: "", password: "" }}
      onSubmit={(values) => handleLoginSubmit(values)}
    >
      {({ handleSubmit }) => (
        <Form className="ui form" onSubmit={handleSubmit} autoComplete="off">
          <Header
            as="h2"
            content="Login to Reactivities"
            color="teal"
            textAlign="center"
          />
          <MyTextInput placeholder="Email" name="email" />
          <MyTextInput placeholder="Password" name="password" type="password" />
          {error && (
            <Label
              style={{ marginBottom: 10 }}
              basic
              color="red"
              content={"Invalid email or password"}
            />
          )}
          <Button
            loading={loading}
            positive
            content="Login"
            type="submit"
            fluid
          />
        </Form>
      )}
    </Formik>
  );
}
