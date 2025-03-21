import { Button, Reveal } from "semantic-ui-react";
import { Profile } from "../../app/models/profile";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { SyntheticEvent } from "react";
import { useDispatch } from "react-redux";
import { updateFollowingRequest } from "../../redux/Slice/profileSlice";

interface Props {
  profile: Profile;
}

export default function FollowButton({ profile }: Props) {
  const dispatch = useDispatch();
  const { loading } = useSelector((state: RootState) => state.profile);
  const { user } = useSelector((state: RootState) => state.users);

  if (user?.username === profile?.username) return null;

  function handleFollow(e: SyntheticEvent, username: string) {
    e.preventDefault();
    dispatch(
      updateFollowingRequest({
        username: username,
        following: !profile.following,
      })
    );
    // if (profile.following) {
    //   dispatch(
    //     updateFollowingRequest({
    //       username: username,
    //       following: false,
    //     })
    //   );
    // } else {
    //   dispatch(
    //     updateFollowingRequest({
    //       username: username,
    //       following: true,
    //     })
    //   );
    // }
  }

  return (
    <Reveal animated="move">
      <Reveal.Content visible style={{ width: "100%" }}>
        <Button
          fluid
          color="teal"
          content={profile.following ? "Following" : "Not following"}
        />
      </Reveal.Content>
      <Reveal.Content hidden style={{ width: "100%" }}>
        <Button
          fluid
          basic
          color={profile.following ? "red" : "green"}
          content={profile.following ? "Unfollow" : "Follow"}
          loading={loading}
          onClick={(e) => handleFollow(e, profile.username)}
        />
      </Reveal.Content>
    </Reveal>
  );
}
