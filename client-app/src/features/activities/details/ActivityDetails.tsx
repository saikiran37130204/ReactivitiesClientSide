import { Grid } from "semantic-ui-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { loadActivityRequest } from "../../../redux/Slice/ActivitiesSlice";
import ActivityDetailedHeader from "./ActivityDetailedHeader";
import ActivityDetailedInfo from "./ActivityDetailedInfo";
import ActivityDetailedSidebar from "./ActivityDetailedSidebar";
import ActivityDetailedChat from "./ActivityDetailedChat";

export default function ActivityDetials() {
  const dispatch = useDispatch();
  const { selectedActivity: activity, loadingInitial } = useSelector(
    (state: RootState) => state.activities
  );

  const { id } = useParams();
  useEffect(() => {
    if (id) {
      dispatch(loadActivityRequest(id));
    }
  }, [id, dispatch]);

  console.log("category field", activity);
  if (loadingInitial || !activity) {
    return <LoadingComponent />;
  }
  return (
    <Grid>
      <Grid.Column width={10}>
        <ActivityDetailedHeader activity={activity} />
        <ActivityDetailedInfo activity={activity} />
        <ActivityDetailedChat />
      </Grid.Column>
      <Grid.Column width={6}>
        <ActivityDetailedSidebar />
      </Grid.Column>
    </Grid>
  );
}
