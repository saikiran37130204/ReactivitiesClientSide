import { Form, Formik } from "formik";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useDispatch } from "react-redux";
import { updateProfileRequest } from "../../redux/Slice/profileSlice";
import { Profile } from "../../app/models/profile";
import * as Yup from "yup";
import MyTextInput from "../../app/common/form/MyTextInput";
import MyTextArea from "../../app/common/form/MyTextArea";
import { Button } from "semantic-ui-react";

interface props {
  setEditMode: (editMode: boolean) => void;
}

export default function ProfileEditForm({ setEditMode }: props) {
  const { profile, loading } = useSelector((state: RootState) => state.profile);
  const dispatch = useDispatch();

  function updateProfile(values: Partial<Profile>) {
    dispatch(updateProfileRequest(values));
    if (!loading) {
      setEditMode(false);
    }
  }

  return (
    <Formik
      initialValues={{ displayName: profile?.displayName, bio: profile?.bio }}
      onSubmit={(values) => updateProfile(values)}
      validationSchema={Yup.object({ displayName: Yup.string().required() })}
    >
      {({ isSubmitting, isValid, dirty }) => (
        <Form className="ui form">
          <MyTextInput placeholder="Display Name" name="displayName" />
          <MyTextArea rows={3} placeholder="Add your bio" name="bio" />
          <Button
            positive
            type="submit"
            loading={isSubmitting}
            content="Update profile"
            floated="right"
            disabled={!isValid || !dirty}
          />
        </Form>
      )}
    </Formik>
  );
}
