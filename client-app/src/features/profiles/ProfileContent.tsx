import { Tab, TabPane } from "semantic-ui-react";
import ProfilePhotos from "./ProfilePhotos";
import { Profile } from "../../app/models/profile";
import ProfileAbout from "./profileAbout";
import ProfileFollowings from "./ProfileFollowings";
import { useDispatch } from "react-redux";
import { setActiveTabRequest } from "../../redux/Slice/profileSlice";

interface Props {
  profile: Profile;
}
export default function ProfileContent({ profile }: Props) {
  const dispatch = useDispatch();

  function setActiveTab(activeTab: number) {
    dispatch(setActiveTabRequest(activeTab));
  }
  const panes = [
    { menuItem: "About", render: () => <ProfileAbout /> },
    { menuItem: "Photos", render: () => <ProfilePhotos profile={profile} /> },
    { menuItem: "Events", render: () => <TabPane>Events Content</TabPane> },
    {
      menuItem: "Followers",
      render: () => <ProfileFollowings />,
    },
    {
      menuItem: "Following",
      render: () => <ProfileFollowings />,
    },
  ];
  return (
    <Tab
      menu={{ fluid: true, vertical: true }}
      menuPosition="right"
      panes={panes}
      onTabChange={(_, data) => setActiveTab(data.activeIndex as number)}
    />
  );
}
