import { Grid } from "semantic-ui-react";
import ProfileHeader from "./ProfileHeader";
import ProfileContent from "./ProfileContent";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { loadProfileRequest, setActiveTabRequest } from "../../redux/Slice/profileSlice";
import LoadingComponent from "../../app/layout/LoadingComponent";

export default function ProfilePage() {
  const dispatch = useDispatch();
  const { username } = useParams<{ username: string }>();
  const { loadingProfile, profile } = useSelector(
    (state: RootState) => state.profile
  );

  useEffect(() => {
    dispatch(loadProfileRequest(username as string));
    return()=>{
    dispatch(setActiveTabRequest(0));
    }
  }, [dispatch, username]);
  
  if (loadingProfile) return <LoadingComponent content="Loading profile..." />;
  return (
    <Grid>
      <Grid.Column width={16}>
        {profile && (
          <>
            <ProfileHeader profile={profile} />
            <ProfileContent profile={profile} />
          </>
        )}
      </Grid.Column>
    </Grid>
  );
}
