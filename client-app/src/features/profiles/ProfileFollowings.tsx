import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { Card, Grid, Header, TabPane } from "semantic-ui-react";
import ProfileCard from "./profileCard";

export default function ProfileFollowings() {
  const { profile, followings, loadingFollowings,activeTab } = useSelector(
    (state: RootState) => state.profile
  );

  return (
    <TabPane loading={loadingFollowings}>
      <Grid>
        <Grid.Column width={16}>
          <Header
            floated="left"
            icon="user"
            content={activeTab===3 ? `People following ${profile?.displayName}`:`People ${profile?.displayName} is following`}
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Card.Group itemsPerRow={4}>
            {followings.map((profile) => (
              <ProfileCard key={profile.username} profile={profile} />
            ))}
          </Card.Group>
        </Grid.Column>
      </Grid>
    </TabPane>
  );
}
