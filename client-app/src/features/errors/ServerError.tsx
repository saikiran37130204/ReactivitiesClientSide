import { useSelector } from "react-redux";
import { Container, Header, Segment } from "semantic-ui-react";
import { RootState } from "../../redux/store";

export default function ServerError() {
  const { error } = useSelector((state: RootState) => state.commonErrors);
  console.log("server error", error);
  if (!error) return null; 
  return (
    <Container>
      <Header as="h1" content="Server Error" />
      <Header sub as="h5" color="red" content={error?.message} />
      {error?.details && (
        <Segment>
          <Header as="h4" content="Stack trace" color="teal" />
          <code style={{ marginTop: "10px" }}>{error.details}</code>
        </Segment>
      )}
    </Container>
  );
}
