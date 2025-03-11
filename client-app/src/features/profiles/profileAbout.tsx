import { useSelector } from "react-redux";
import { Button, Grid, GridColumn, Header, TabPane } from "semantic-ui-react";
import { RootState } from "../../redux/store";
import { useState } from "react";
import ProfileEditForm from "./profileEditForm";

export default function ProfileAbout() {
  const { profile } = useSelector((state: RootState) => state.profile);
  const { user } = useSelector((state: RootState) => state.users);
  const [editMode, setEditMode] = useState(false);

  const isCurrentUser = () => {
    if (user && profile) {
      return user.username === profile.username;
    }
    return false;
  };
  return (
    <TabPane>
      <Grid>
        <GridColumn width="16">
          <Header
            floated="left"
            icon="user"
            content={`About ${profile?.displayName}`}
          />
          {isCurrentUser() && (
            <Button
              floated="right"
              basic
              content={editMode ? "Cancel" : "Edit Profile"}
              onClick={() => setEditMode(!editMode)}
            />
          )}
        </GridColumn>
        <GridColumn width="16">
          {editMode ? (
            <ProfileEditForm setEditMode={setEditMode} />
          ) : (
            <span style={{ whiteSpace: "pre-wrap" }}>{profile?.bio}</span>
          )}
        </GridColumn>
      </Grid>
    </TabPane>
  );
}
