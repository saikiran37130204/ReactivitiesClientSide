import { Button, Card, Grid, Header, Image, TabPane } from "semantic-ui-react";
import { Photo, Profile } from "../../app/models/profile";
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";
import { SyntheticEvent, useEffect, useState } from "react";
import PhotoUploadWidget from "../../app/common/ImageUpload/PhotoUploadWidget";
import { useDispatch } from "react-redux";
import {
  deletePhotoRequest,
  setMainPhotoRequest,
  uploadPhotoRequest,
} from "../../redux/Slice/profileSlice";

interface Props {
  profile: Profile;
}

export default function ProfilePhotos({ profile }: Props) {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.users);
  const { uploading, error, loading } = useSelector(
    (state: RootState) => state.profile
  );

  const isCurrentUser = () => {
    if (user && profile) {
      return user.username === profile.username;
    }
    return false;
  };

  const [addPhotoMode, setAddPhotoMode] = useState(false);

  const [target, setTarget] = useState("");

  const handlePhotoUpload = (blob: Blob) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob); // Convert the Blob to a Base64 string
    reader.onload = () => {
      const base64File = reader.result as string; // Get the Base64 string
      dispatch(uploadPhotoRequest(base64File)); // Dispatch the Base64 string
    };
    reader.onerror = (error) => {
      console.error("Error converting Blob to Base64:", error);
    };
  };

  function handleSetMainPhoto(
    photo: Photo,
    e: SyntheticEvent<HTMLButtonElement>
  ) {
    setTarget(e.currentTarget.name);
    dispatch(setMainPhotoRequest(photo));
  }

  function handleDeletePhoto(
    photo: Photo,
    e: SyntheticEvent<HTMLButtonElement>
  ) {
    setTarget(e.currentTarget.name);
    dispatch(deletePhotoRequest(photo));
  }
  useEffect(() => {
    if (!uploading && !error) {
      setAddPhotoMode(false); // Close the photo upload mode when upload is successful
    }
  }, [uploading, error]);

  return (
    <TabPane>
      <Grid>
        <Grid.Column width={16}>
          <Header floated="left" icon="image" content="Photos" />
          {isCurrentUser() && (
            <Button
              floated="right"
              basic
              content={addPhotoMode ? "Cancel" : "Add Photo"}
              onClick={() => setAddPhotoMode(!addPhotoMode)}
            />
          )}
        </Grid.Column>
        <Grid.Column width={16}>
          {addPhotoMode ? (
            <PhotoUploadWidget
              uploadPhoto={handlePhotoUpload}
              loading={uploading}
            />
          ) : (
            <Card.Group itemsPerRow={5}>
              {profile.photos?.map((photo) => (
                <Card key={photo.url}>
                  <Image src={photo.url} />
                  {isCurrentUser() && (
                    <Button.Group fluid widths={2}>
                      <Button
                        basic
                        color="green"
                        content="Main"
                        name={"main" + photo.id}
                        disabled={photo.isMain}
                        loading={target === "main" + photo.id && loading}
                        onClick={(e) => handleSetMainPhoto(photo, e)}
                      />
                      <Button
                        basic
                        color="red"
                        icon="trash"
                        loading={target === photo.id && loading}
                        onClick={(e) => handleDeletePhoto(photo, e)}
                        disabled={photo.isMain}
                        name={photo.id}
                      />
                    </Button.Group>
                  )}
                </Card>
              ))}
            </Card.Group>
          )}
        </Grid.Column>
      </Grid>
    </TabPane>
  );
}
