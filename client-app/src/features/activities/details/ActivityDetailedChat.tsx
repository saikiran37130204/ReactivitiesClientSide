import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Segment, Header, Comment, Loader } from "semantic-ui-react";
import {
  AddCommentFailure,
  clearComments,
  createHubConnectionFailure,
  loadComments,
  receiveComment,
} from "../../../redux/Slice/commentSlice";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { Link } from "react-router-dom";
import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from "@microsoft/signalr";
import { Formik, Form, FormikHelpers, Field, FieldProps } from "formik";
import * as Yup from "yup";
import { formatDistanceToNow } from "date-fns";
import { ChatComment } from "../../../app/models/comment";

interface Props {
  activityId: string;
}

interface CommentFormValues {
  body: string;
  activityId?: string;
}

export default function ActivityDetailedChat({ activityId }: Props) {
  const dispatch = useDispatch();
  const { comments } = useSelector((state: RootState) => state.comment);
  console.log("comments", comments);
  const { selectedActivity } = useSelector(
    (state: RootState) => state.activities
  );
  const { user } = useSelector((state: RootState) => state.users);

  const [hubConnection, setHubConnection] = useState<HubConnection | null>(
    null
  );

  useEffect(() => {
    if (activityId) {
      const newConnection = new HubConnectionBuilder()
        .withUrl("http://localhost:5000/chat?activityId=" + activityId, {
          accessTokenFactory: () => user?.token || "",
        })
        .withAutomaticReconnect()
        .configureLogging(LogLevel.Information)
        .build();

      setHubConnection(newConnection);

      newConnection
        .start()
        .then(() => {
          console.log("Connection established successfully");

          // Set up event listeners for incoming messages
          newConnection.on("LoadComments", (comments: ChatComment[]) => {
            dispatch(loadComments(comments));
          });

          newConnection.on("ReceiveComment", (comment: ChatComment) => {
            dispatch(receiveComment(comment));
          });
        })
        .catch((error) => {
          // Extract the error message and dispatch only the message
          const errorMessage =
            error.message || "Failed to establish connection";
          dispatch(createHubConnectionFailure(errorMessage));
          console.log("Error establishing the connection: ", error);
        });
    }

    // Cleanup function
    return () => {
      if (hubConnection) {
        console.log("Stopping hub connection...");
        hubConnection
          .stop()
          .then(() => {
            console.log("Hub connection stopped successfully");
          })
          .catch((error) => {
            console.log("Error stopping connection: ", error);
          });
      }
      dispatch(clearComments());
    };
  }, [activityId, dispatch]);

  const handleAddComment = async (values: CommentFormValues): Promise<void> => {
    values.activityId = selectedActivity?.id;
    if (hubConnection) {
      try {
        await hubConnection.invoke("SendComment", values);
      } catch (error) {
        dispatch(AddCommentFailure(error));
        console.log("Error sending comment: ", error);
      }
    }
  };

  return (
    <>
      <Segment
        textAlign="center"
        attached="top"
        inverted
        color="teal"
        style={{ border: "none" }}
      >
        <Header>Chat about this event</Header>
      </Segment>
      <Segment attached clearing>
        <Formik
          onSubmit={(
            values: CommentFormValues,
            { resetForm }: FormikHelpers<CommentFormValues>
          ) => {
            return handleAddComment(values).then(() => resetForm());
          }}
          initialValues={{ body: "" }}
          validationSchema={Yup.object({
            body: Yup.string().required(),
          })}
        >
          {({ isSubmitting, isValid, handleSubmit }) => (
            <Form className="ui form">
              <Field name="body">
                {(props: FieldProps) => (
                  <div style={{ position: "relative" }}>
                    <Loader active={isSubmitting} />
                    <textarea
                      placeholder="Enter your comment (Enter to submit, SHIFT + enter for new line)"
                      rows={2}
                      {...props.field}
                      onKeyDown={(e) => {
                        if (e.key === "enter" && e.shiftKey) {
                          return;
                        }
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                          isValid && handleSubmit();
                        }
                      }}
                    />
                  </div>
                )}
              </Field>
            </Form>
          )}
        </Formik>
        <Comment.Group>
          {comments.map((comment) => (
            <Comment key={`${comment.id}-${comment.createdAt}`}>
              <Comment.Avatar src={comment.image || "/Asserts/user.png"} />
              <Comment.Content>
                <Comment.Author as={Link} to={`/profiles/${comment.username}`}>
                  {comment.username}
                </Comment.Author>
                <Comment.Metadata>
                  <div>{formatDistanceToNow(comment.createdAt)}</div>
                </Comment.Metadata>
                <Comment.Text style={{ whiteSpace: "pre-wrap" }}>
                  {comment.body}
                </Comment.Text>
              </Comment.Content>
            </Comment>
          ))}
        </Comment.Group>
      </Segment>
    </>
  );
}
