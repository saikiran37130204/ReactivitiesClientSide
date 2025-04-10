import {
  Card,
  Grid,
  Header,
  Tab,
  TabPane,
  Image,
  TabProps,
} from "semantic-ui-react";
import { UserActivity } from "../../app/models/profile";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { SyntheticEvent, useEffect } from "react";
import { loadUserActivitiesRequest } from "../../redux/Slice/profileSlice";

const panes = [
  { menuItem: "Future Events", pane: { key: "future" } },
  { menuItem: "Past Events", pane: { key: "past" } },
  { menuItem: "Hosting", pane: { key: "hosting" } },
];

export default function ProfileActivities() {
  const { profile, loadingActivities, UserActivities } = useSelector(
    (state: RootState) => state.profile
  );
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(loadUserActivitiesRequest({ username: profile!.username }));
  }, [dispatch, profile]);
  const handleTabChange = (_e: SyntheticEvent, data: TabProps) => {
    dispatch(
      loadUserActivitiesRequest({
        username: profile!.username,
        predicate: panes[data.activeIndex as number].pane.key,
      })
    );
  };
  return (
    <TabPane loading={loadingActivities}>
      <Grid>
        <Grid.Column width={16}>
          <Header floated="left" icon="calendar" content={"Activities"} />
        </Grid.Column>
        <Grid.Column width={16}>
          <Tab
            panes={panes}
            menu={{ secondary: true, pointing: true }}
            onTabChange={(e, data) => handleTabChange(e, data)}
          />
          <br />
          <Card.Group itemsPerRow={4}>
            {UserActivities.map((activity: UserActivity) => (
              <Card
                as={Link}
                to={`/activities/${activity.id}`}
                key={activity.id}
              >
                <Image
                  src={`/Asserts/categoryImages/${activity.category}.jpg`}
                  style={{ minHeight: 100, objectFit: "cover" }}
                />
                <Card.Content>
                  <Card.Header textAlign="center">{activity.title}</Card.Header>
                  <Card.Meta textAlign="center">
                    <div>{format(new Date(activity.date), "do LLL")}</div>
                    <div>{format(new Date(activity.date), "h:mm a")}</div>
                  </Card.Meta>
                </Card.Content>
              </Card>
            ))}
          </Card.Group>
        </Grid.Column>
      </Grid>
    </TabPane>
  );
}
