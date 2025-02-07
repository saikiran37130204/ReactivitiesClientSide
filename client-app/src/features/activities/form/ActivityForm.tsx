import { Button, Header, Segment } from "semantic-ui-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import {
  createActivityRequest,
  loadActivityRequest,
  updateActivityRequest,
} from "../../../redux/Slice/ActivitiesSlice";
import { Link, useNavigate, useParams } from "react-router-dom";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { v4 as uuid } from "uuid";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import MyTextInput from "../../../app/common/form/MyTextInput";
import MyTextArea from "../../../app/common/form/MyTextArea";
import MySelectInput from "../../../app/common/form/MySelectInput";
import { categoreyOptions } from "../../../app/common/options/categoryOptions";
import MyDateInput from "../../../app/common/form/MyDateInput";
import { ActivityFormValues } from "../../../app/models/activity";

export default function ActivityForm() {
  const dispatch = useDispatch<AppDispatch>();

  const { selectedActivity, loadingInitial } = useSelector(
    (state: RootState) => state.activities
  );
  console.log("Activity form", selectedActivity);
  const { id } = useParams();
  const navigate = useNavigate();

  // const initialState: Activity = useMemo(
  //   () => ({
  //     id: "",
  //     title: "",
  //     category: "",
  //     description: "",
  //     date: null,
  //     city: "",
  //     venue: "",
  //   }),
  //   []
  // );

  const validationSchema = Yup.object({
    title: Yup.string().required("The activity title is required"),
    description: Yup.string().required("The activity description is required"),
    category: Yup.string().required(),
    date: Yup.string().required(),
    venue: Yup.string().required(),
    city: Yup.string().required(),
  });
  const [activity, setActivity] = useState<ActivityFormValues>(
    new ActivityFormValues()
  );

  useEffect(() => {
    if (id) {
      dispatch(loadActivityRequest(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (selectedActivity) {
      setActivity(new ActivityFormValues(selectedActivity));
    } else {
      setActivity(new ActivityFormValues());
    }
  }, [selectedActivity]);

  function handleFormSubmit(activity: ActivityFormValues) {
    if (activity.id) {
      const plainActivity = { ...activity }; // Convert to plain object
      dispatch(updateActivityRequest(plainActivity));
      navigate(`/activities/${activity.id}`);
    } else {
      activity.id = uuid();
      const plainActivity = { ...activity }; // Convert to plain object
      dispatch(createActivityRequest(plainActivity));
      navigate(`/activities/${activity.id}`);
    }
  }

  if (loadingInitial) return <LoadingComponent content="Loading activity..." />;
  return (
    <Segment clearing>
      <Header content="Activity Details" sub color="teal" />
      <Formik
        validationSchema={validationSchema}
        enableReinitialize
        initialValues={activity}
        onSubmit={(values) => handleFormSubmit(values)}
      >
        {({ handleSubmit, isValid, isSubmitting, dirty }) => (
          <Form className="ui form" onSubmit={handleSubmit} autoComplete="off">
            <MyTextInput name="title" placeholder="Title" />
            <MyTextArea rows={3} placeholder="Description" name="description" />
            <MySelectInput
              options={categoreyOptions}
              placeholder="Category"
              name="category"
            />
            <MyDateInput
              placeholderText="Date"
              name="date"
              showTimeSelect
              timeCaption="time"
              dateFormat="MMMM d, yyyy h:mm aa"
            />
            <Header content="Location Details" sub color="teal" />
            <MyTextInput placeholder="City" name="city" />
            <MyTextInput placeholder="Venue" name="venue" />
            <Button
              disabled={isSubmitting || !dirty || !isValid}
              loading={isSubmitting}
              floated="right"
              positive
              type="submit"
              content="Submit"
            />
            <Button
              as={Link}
              to="/activities"
              floated="right"
              type="button"
              content="Cancel"
            />
          </Form>
        )}
      </Formik>
    </Segment>
  );
}
