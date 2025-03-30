import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ChatComment } from "../../app/models/comment";

export interface CommentState {
  comments: ChatComment[];

  error: string | null | unknown | undefined;
}
const initialState: CommentState = {
  comments: [],
  error: null,
};

const commentSlice = createSlice({
  name: "commentes",
  initialState,
  reducers: {
    loadComments(state, action: PayloadAction<ChatComment[]>) {
      const comments = action.payload;
      comments.forEach((comment) => {
        comment.createdAt = new Date(comment.createdAt + "Z");
      });
      state.comments = comments;
    },
    receiveComment(state, action: PayloadAction<ChatComment>) {
      const existingComment = state.comments.find(
        (comment) => comment.id === action.payload.id
      );
      if (!existingComment) {
        action.payload.createdAt = new Date(action.payload.createdAt);
        state.comments.unshift(action.payload);
      }
    },
    clearComments(state) {
      state.comments = [];
      state.error = null;
    },
    createHubConnectionFailure(
      state,
      action: PayloadAction<string | unknown | null>
    ) {
      state.error = action.payload;
    },

    // // eslint-disable-next-line @typescript-eslint/no-unused-vars
    // createHubConnectionRequest(_s, _: PayloadAction<string>) {},
    // createHubConnectionSuccess(
    //   state,
    //   action: PayloadAction<{
    //     activityId: string;
    //     activity: Activity;
    //     user: User;
    //   }>
    // ) {
    //   const activityId = action.payload.activityId;
    //   const selectedActivity = action.payload.activity;
    //   const user = action.payload.user;
    //   if (selectedActivity) {
    //     state.hubConnection = new HubConnectionBuilder()
    //       .withUrl("http://localhost:5000/chat?activityId=" + activityId, {
    //         accessTokenFactory: () => user?.token,
    //       })
    //       .withAutomaticReconnect()
    //       .configureLogging(LogLevel.Information)
    //       .build();

    //     state.hubConnection
    //       .start()
    //       .catch((error) =>
    //         console.log("Error establishing the connection: ", error)
    //       );

    //     state.hubConnection.on("LoadComments", (comments: ChatComment[]) => {
    //       state.comments = comments;
    //     });

    //     state.hubConnection.on("ReceiveComment", (comment: ChatComment) => {
    //       state.comments.push(comment);
    //     });
    //   }
    // },

    // // clearComments(state) {
    // //   state.comments = [];
    // //   state.hubConnection
    // //     ?.stop()
    // //     .catch((error) => console.log("Error stopping connection: ", error));
    // // },
    // // createHubConnectionFailure(
    // //   state,
    // //   action: PayloadAction<string | unknown | null>
    // // ) {
    // //   state.error = action.payload;
    // // },

    // AddCommentRequest(
    //   // eslint-disable-next-line @typescript-eslint/no-unused-vars
    //   _s,
    //   // eslint-disable-next-line @typescript-eslint/no-unused-vars
    //   _: PayloadAction<{ body: string; activityId?: string }>
    // ) {},

    AddCommentFailure(state, action: PayloadAction<string | unknown | null>) {
      state.error = action.payload;
    },
  },
});

export const {
  loadComments,
  receiveComment,
  createHubConnectionFailure,
  clearComments,

  AddCommentFailure,
} = commentSlice.actions;

export default commentSlice.reducer;
