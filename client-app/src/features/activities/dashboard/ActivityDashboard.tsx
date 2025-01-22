import { Grid } from "semantic-ui-react";
import ActivityList from "./ActivityList";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { useEffect } from "react";
import { fetchActivitiesRequest } from "../../../redux/Slice/ActivitiesSlice";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import ActivityFilters from "./ActivityFilters";

export default function ActivityDashboard() {
  const { activities } = useSelector((state: RootState) => state.activities);

  const dispatch = useDispatch();
  const { loadingInitial } = useSelector(
    (state: RootState) => state.activities
  );

  useEffect(() => {
    if (activities.length === 0) {
      dispatch(fetchActivitiesRequest());
    }
  }, [activities.length, dispatch]);

  if (loadingInitial) return <LoadingComponent content="Loading app" />;

  return (
    <Grid>
      <Grid.Column width="10">
        <ActivityList />
      </Grid.Column>
      <Grid.Column width="6">
        <ActivityFilters/>
      </Grid.Column>
    </Grid>
  );
}
