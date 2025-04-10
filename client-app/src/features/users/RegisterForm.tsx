import { Form, Formik } from "formik";
import MyTextInput from "../../app/common/form/MyTextInput";
import { Button, Header } from "semantic-ui-react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useDispatch } from "react-redux";
import { registerUserRequest } from "../../redux/Slice/usersSlice";
import { UserFormValues } from "../../app/models/User";
import * as Yup from "yup";
import ValidationError from "../errors/ValidationError";

export default function RegisterForm() {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state: RootState) => state.users);
  function handleRegisterSubmit(values: UserFormValues) {
    if (values) {
      dispatch(registerUserRequest(values));
    }
  }

  return (
    <Formik
      initialValues={{ displayName: "", username: "", email: "", password: "" }}
      onSubmit={(values) => handleRegisterSubmit(values)}
      validationSchema={Yup.object({
        displayName: Yup.string().required(),
        username: Yup.string().required(),
        email: Yup.string().required(),
        password: Yup.string().required(),
      })}
    >
      {({ handleSubmit, isValid, dirty }) => (
        <Form
          className="ui form error"
          onSubmit={handleSubmit}
          autoComplete="off"
        >
          <Header
            as="h2"
            content="Sign up to Reactivities"
            color="teal"
            textAlign="center"
          />
          <MyTextInput placeholder="Display Name" name="displayName" />
          <MyTextInput placeholder="Username" name="username" />
          <MyTextInput placeholder="Email" name="email" />
          <MyTextInput placeholder="Password" name="password" type="password" />
          {error! && <ValidationError errors={[error.toString()]} />}
          <Button
            disabled={!isValid || !dirty || loading}
            loading={loading}
            positive
            content="Register"
            type="submit"
            fluid
          />
        </Form>
      )}
    </Formik>
  );
}
