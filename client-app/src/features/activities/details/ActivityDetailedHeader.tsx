import { Button, Header, Item, Segment, Image, Label } from "semantic-ui-react";
import { Activity } from "../../../app/models/activity";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { useDispatch } from "react-redux";
import {
  cancelActivityToggleRequest,
  updateAttendanceRequest,
} from "../../../redux/Slice/ActivitiesSlice";

const activityImageStyle = {
  filter: "brightness(30%)",
};

const activityImageTextStyle = {
  position: "absolute",
  bottom: "5%",
  left: "5%",
  width: "100%",
  height: "auto",
  color: "white",
};

interface Props {
  activity: Activity;
}

export default (function ActivityDetailedHeader({ activity }: Props) {
  const { loading } = useSelector((state: RootState) => state.activities);
  const dispatch = useDispatch();

  function CancelOrJoinAttendance() {
    dispatch(updateAttendanceRequest());
  }
  function cancelActivityToggle() {
    dispatch(cancelActivityToggleRequest());
  }

  return (
    <Segment.Group>
      <Segment basic attached="top" style={{ padding: "0" }}>
        {activity.isCancelled && (
          <Label
            style={{ position: "absolute", zIndex: 1000, left: -14, top: 20 }}
            ribbon
            color="red"
            content="Cancelled"
          />
        )}
        <Image
          src={`/assets/categoryImages/${activity.category}.jpg`}
          fluid
          style={activityImageStyle}
        />
        <Segment style={activityImageTextStyle} basic>
          <Item.Group>
            <Item>
              <Item.Content>
                <Header
                  size="huge"
                  content={activity.title}
                  style={{ color: "white" }}
                />
                <p>{format(activity.date!, "dd MMM yyyy")}</p>
                <p>
                  Hosted by{" "}
                  <strong>
                    <Link to={`/profile/${activity.host?.username}`}>
                      {activity.host?.displayName}
                    </Link>
                  </strong>
                </p>
              </Item.Content>
            </Item>
          </Item.Group>
        </Segment>
      </Segment>
      <Segment clearing attached="bottom">
        {activity.isHost ? (
          <>
            <Button
              color={activity.isCancelled ? "green" : "red"}
              floated="left"
              basic
              content={
                activity.isCancelled
                  ? "Re-activate Activity"
                  : "Cancel Activity"
              }
              onClick={cancelActivityToggle}
              loading={loading}
            />
            <Button
              disabled={activity.isCancelled}
              as={Link}
              to={`/manage/${activity.id}`}
              color="orange"
              floated="right"
            >
              Manage Event
            </Button>
          </>
        ) : activity.isGoing ? (
          <Button loading={loading} onClick={CancelOrJoinAttendance}>
            Cancel attendance
          </Button>
        ) : (
          <Button
            disabled={activity.isCancelled}
            loading={loading}
            onClick={CancelOrJoinAttendance}
            color="teal"
          >
            Join Activity
          </Button>
        )}
      </Segment>
    </Segment.Group>
  );
});
