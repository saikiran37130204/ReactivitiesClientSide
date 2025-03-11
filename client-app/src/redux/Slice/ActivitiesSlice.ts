import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Activity, ActivityFormValues } from "../../app/models/activity";
import { format } from "date-fns";
import { User } from "../../app/models/User";
import { Profile } from "../../app/models/profile";

interface ActivityState {
  activityId: string | null;
  activities: Activity[];
  groupedActivities: [string, Activity[]][];
  selectedActivity: Activity | undefined;
  activity: ActivityFormValues | undefined;
  editMode: boolean;
  loading: boolean;
  loadingInitial: boolean;
  error?: string | null | unknown | undefined;
}

const initialState: ActivityState = {
  activityId: null,
  activities: [],
  groupedActivities: [],
  selectedActivity: undefined,
  activity: undefined,
  editMode: false,
  loading: false,
  loadingInitial: false,
  error: undefined,
};

const sortActivitiesByDate = (activities: Activity[]) => {
  return activities.sort((a, b) => {
    const dateA = a.date ? new Date(a.date).getTime() : 0;
    const dateB = b.date ? new Date(b.date).getTime() : 0;
    return dateA - dateB;
  });
};

const groupedActivities = (activities: Activity[]) => {
  return Object.entries(
    activities.reduce((activities, activity) => {
      const date = format(activity.date!, "dd MMM yyyy");
      activities[date] = activities[date]
        ? [...activities[date], activity]
        : [activity];
      return activities;
    }, {} as { [key: string]: Activity[] })
  );
};

const SetActivityDate = (activity: Activity, user: User | null | undefined) => {
  const host = activity.attendees?.find(
    (x) => x.username === activity.hostUsername
  );
  const going =
    activity.attendees!.some((a) => a.username === user?.username) || false;
  console.log("setactivitydate", user, going, user?.username);
  return {
    ...activity,
    isGoing: user ? going : false,
    isHost: user ? activity.hostUsername === user.username : false,
    host: host || undefined,
    date: activity.date ? new Date(activity.date) : null,
  };
};

const activitySlice = createSlice({
  name: "activities",
  initialState,
  reducers: {
    fetchActivitiesRequest(state) {
      state.loadingInitial = true;
      state.error = undefined;
    },
    fetchActivitiesSuccess(
      state,
      action: PayloadAction<{ activities: Activity[]; user: User | null }>
    ) {
      // Map activities and ensure `date` is a Date object
      const activities = action.payload.activities.map((activity) => ({
        ...activity,
        date: activity.date ? new Date(activity.date) : null,
      }));

      // Sort activities by date
      const sortedActivities = sortActivitiesByDate(activities);

      // Set activity dates and host information
      state.activities = sortedActivities.map((activity) =>
        SetActivityDate(activity, action.payload.user)
      );

      // Group activities by date
      state.groupedActivities = groupedActivities(state.activities);

      state.loadingInitial = false;
    },
    fetchActivitiesFailure(state, action: PayloadAction<string | unknown>) {
      state.loadingInitial = false;
      state.error =
        action.payload instanceof Error
          ? action.payload.message
          : String(action.payload);
    },
    loadActivityRequest(state, action: PayloadAction<string>) {
      state.loadingInitial = true;
      state.selectedActivity = undefined;
      state.activityId = action.payload || "";
    },
    loadActivitySuccess(
      state,
      action: PayloadAction<{ activity: Activity; user: User | null }>
    ) {
      state.loadingInitial = false;
      const { activity, user } = action.payload;
      console.log(activity, user);
      state.selectedActivity = SetActivityDate(activity, user);
    },
    loadActivityFailure(state, action: PayloadAction<string | unknown>) {
      state.loadingInitial = false;
      state.selectedActivity = undefined;
      state.error =
        action.payload instanceof Error
          ? action.payload.message
          : String(action.payload);
    },
    resetSelectedActivity(state) {
      state.selectedActivity = undefined;
      state.activityId = null;
      state.loadingInitial = false;
      state.error = null;
    },
    createActivityRequest(state, action: PayloadAction<ActivityFormValues>) {
      state.loading = true;
      state.activity = {
        ...action.payload,
        date: action.payload?.date,
      };
      console.log("create");
    },
    createActivitySuccess(
      state,
      action: PayloadAction<{ activity: ActivityFormValues; user: User | null }>
    ) {
      const { activity, user } = action.payload;
      const attendee = new Profile(user!);
      const newActivity = new Activity(activity);
      newActivity.hostUsername = user!.username;
      newActivity.attendees = [attendee];
      state.selectedActivity = SetActivityDate(newActivity, user);
      state.loading = false;
      state.editMode = false;
      state.activities = sortActivitiesByDate([
        newActivity,
        ...state.activities,
      ]);
      state.groupedActivities = groupedActivities(state.activities);
    },
    createActivityFailure(state, action: PayloadAction<string | unknown>) {
      state.loading = false;
      state.error =
        action.payload instanceof Error
          ? action.payload.message
          : String(action.payload);
    },
    updateActivityRequest(state, action: PayloadAction<ActivityFormValues>) {
      state.loading = true;
      state.activity = action.payload;
    },
    updateActivitySuccess(
      state,
      action: PayloadAction<{
        activityFormValues: ActivityFormValues;
        user: User | null;
      }>
    ) {
      state.loading = false;
      state.editMode = false;

      // Convert ActivityFormValues to Activity
      const updatedActivity = new Activity(action.payload.activityFormValues);

      console.log("updatedActivity", updatedActivity);

      // Update the activities array
      state.activities = sortActivitiesByDate(
        state.activities.map((activity) =>
          activity.id === updatedActivity.id ? updatedActivity : activity
        )
      );

      // Update grouped activities
      state.groupedActivities = groupedActivities(state.activities);

      // Update selectedActivity
      state.selectedActivity = SetActivityDate(
        updatedActivity,
        action.payload.user
      );
    },
    updateActivityFailure(state, action: PayloadAction<string | unknown>) {
      console.log(action.payload);
      state.loading = false;
      state.error =
        action.payload instanceof Error
          ? action.payload.message
          : String(action.payload);
    },
    deleteActivityRequest(state, action: PayloadAction<string>) {
      state.loading = true;
      state.activityId = action.payload;
    },
    deleteActivitySuccess(state, action: PayloadAction<string>) {
      state.loading = false;
      state.activities = sortActivitiesByDate(
        state.activities.filter((activity) => activity.id !== action.payload)
      );
      if (state.selectedActivity?.id === action.payload) {
        state.selectedActivity = undefined;
      }
      state.activityId = null;
    },
    deleteActivityFailure(state, action: PayloadAction<string | unknown>) {
      state.loading = false;
      state.error =
        action.payload instanceof Error
          ? action.payload.message
          : String(action.payload);
    },
    updateAttendanceRequest(state) {
      state.loading = true;
    },
    updateAttendanceSuccess(state, action: PayloadAction<User | null>) {
      state.loading = false;
      if (state.selectedActivity?.isGoing) {
        state.selectedActivity.attendees =
          state.selectedActivity.attendees?.filter(
            (a) => a.username !== action.payload?.username
          );
        state.selectedActivity.isGoing = false;
      } else {
        const attendee = new Profile(action.payload!);
        state.selectedActivity?.attendees?.push(attendee);
        state.selectedActivity!.isGoing = true;
      }
      if (state.selectedActivity) {
        state.activities = state.activities.map((activity) =>
          activity.id === state.selectedActivity!.id
            ? state.selectedActivity!
            : activity
        );
      }
      state.groupedActivities = groupedActivities(state.activities);
    },
    updateAttendanceFailure(state, action: PayloadAction<string | unknown>) {
      state.error = action.payload;
    },
    cancelActivityToggleRequest(state) {
      state.loading = true;
    },
    cancelActivityToggleSuccess(state) {
      state.loading = false;
      if (state.selectedActivity) {
        state.selectedActivity.isCancelled =
          !state.selectedActivity.isCancelled;
        state.activities = state.activities.map((activity) =>
          activity.id === state.selectedActivity!.id
            ? state.selectedActivity!
            : activity
        );
        state.groupedActivities = groupedActivities(state.activities);
      }
    },
    cancelActivityToggleFailure(
      state,
      action: PayloadAction<string | unknown>
    ) {
      console.log("toggle error", action.payload);
      state.loading = false;
      state.error = action.payload;
    },
    clearSelectedActivity(state){
      state.selectedActivity=undefined;
    }
  },
});

export const {
  fetchActivitiesRequest,
  fetchActivitiesSuccess,
  fetchActivitiesFailure,
  createActivityRequest,
  createActivitySuccess,
  createActivityFailure,
  updateActivityRequest,
  updateActivitySuccess,
  updateActivityFailure,
  deleteActivityRequest,
  deleteActivitySuccess,
  deleteActivityFailure,
  loadActivityRequest,
  loadActivitySuccess,
  loadActivityFailure,
  resetSelectedActivity,
  updateAttendanceRequest,
  updateAttendanceSuccess,
  updateAttendanceFailure,
  cancelActivityToggleRequest,
  cancelActivityToggleSuccess,
  cancelActivityToggleFailure,
  clearSelectedActivity
} = activitySlice.actions;

export default activitySlice.reducer;
