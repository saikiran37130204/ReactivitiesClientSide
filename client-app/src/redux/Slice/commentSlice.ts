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
