import { Button, Form, Segment } from "semantic-ui-react";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
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

export default function ActivityForm() {
  const dispatch = useDispatch<AppDispatch>();

  const { selectedActivity, loading, loadingInitial } = useSelector(
    (state: RootState) => state.activities
  );
  console.log("Activity form", selectedActivity);
  const { id } = useParams();
  const navigate = useNavigate();

  const initialState = useMemo(
    () => ({
      id: "",
      title: "",
      category: "",
      description: "",
      date: "",
      city: "",
      venue: "",
    }),
    []
  );

  console.log("Activity form", initialState);
  const [activity, setActivity] = useState(initialState);

  useEffect(() => {
    if (id) {
      dispatch(loadActivityRequest(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (selectedActivity) {
      setActivity(selectedActivity);
    } else {
      setActivity(initialState);
    }
  }, [selectedActivity, initialState]);

  function handleSubmit() {
    if (activity.id) {
      dispatch(updateActivityRequest(activity));
      navigate(`/activities/${activity.id}`);
    } else {
      activity.id = uuid();
      dispatch(createActivityRequest(activity));
      navigate(`/activities/${activity.id}`);
    }
  }

  function handleInputChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = event.target;
    setActivity({ ...activity, [name]: value });
  }

  if (loadingInitial) return <LoadingComponent content="Loading activity..." />;
  return (
    <Segment clearing>
      <Form onSubmit={handleSubmit} autoComplete="on">
        <Form.Input
          placeholder="Title"
          value={activity.title}
          name="title"
          onChange={handleInputChange}
        />
        <Form.TextArea
          placeholder="Description"
          value={activity.description}
          name="description"
          onChange={handleInputChange}
        />
        <Form.Input
          placeholder="Category"
          value={activity.category}
          name="category"
          onChange={handleInputChange}
        />
        <Form.Input
          type="date"
          placeholder="Date"
          value={activity.date}
          name="date"
          onChange={handleInputChange}
        />
        <Form.Input
          placeholder="City"
          value={activity.city}
          name="city"
          onChange={handleInputChange}
        />
        <Form.Input
          placeholder="Venue"
          value={activity.venue}
          name="venue"
          onChange={handleInputChange}
        />
        <Button
          loading={loading}
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
    </Segment>
  );
}
