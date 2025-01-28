import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Activity } from "../../app/models/activity";
import { format } from "date-fns";

interface ActivityState {
  activityId: string | null;
  activities: Activity[];
  groupedActivities: [string, Activity[]][];
  selectedActivity: Activity | undefined;
  activity: Activity | undefined;
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

const sortActivitiesByDate = (activities: Activity[]) =>
  activities.sort((a, b) => a.date!.getTime() - b.date!.getTime());

const groupedActivities = (activities: Activity[]) => {
  return Object.entries(
    activities.reduce((activities, activity) => {
      const date = format(activity.date!,'dd MMM yyyy')
      activities[date] = activities[date]
        ? [...activities[date], activity]
        : [activity];
      return activities;
    }, {} as { [key: string]: Activity[] })
  );
};

const SetActivityDate = (activity: Activity) => ({
  ...activity,
  date:
  activity.date ? new Date(activity.date) : null,
});

const activitySlice = createSlice({
  name: "activities",
  initialState,
  reducers: {
    fetchActivitiesRequest(state) {
      state.loadingInitial = true;
      state.error = undefined;
    },
    fetchActivitiesSuccess(state, action: PayloadAction<Activity[]>) {
      const activities = action.payload.map((activity) => ({
        ...activity,
        date:
          activity.date!
      }));
      state.activities = activities.map(SetActivityDate);
      state.loadingInitial = false;
      state.groupedActivities = groupedActivities(activities);
    },
    fetchActivitiesFailure(state, action: PayloadAction<string | unknown>) {
      state.loadingInitial = false;
      state.error = action.payload;
    },
    loadActivityRequest(state, action: PayloadAction<string>) {
      state.loadingInitial = true;
      state.selectedActivity = undefined;
      state.activityId = action.payload || "";
    },
    loadActivitySuccess(state, action: PayloadAction<Activity>) {
      state.loadingInitial = false;
      state.selectedActivity = {
        ...action.payload,
        date: action.payload.date,
      };
      state.selectedActivity = SetActivityDate(action.payload);
    },
    loadActivityFailure(state, action: PayloadAction<string | unknown>) {
      state.loadingInitial = false;
      state.selectedActivity = undefined;
      state.error = action.payload;
    },
    resetSelectedActivity(state) {
      state.selectedActivity = undefined;
      state.activityId = null;
      state.loadingInitial = false;
      state.error = null;
    },
    createActivityRequest(state, action: PayloadAction<Activity>) {
      state.loading = true;
      state.activity = {
        ...action.payload,
        date: action.payload?.date
      };
    },
    createActivitySuccess(state, action: PayloadAction<Activity>) {
      state.loading = false;
      state.editMode = false;
      state.activities = sortActivitiesByDate([
        action.payload,
        ...state.activities,
      ]);
      state.selectedActivity = {
        ...action.payload,
        date: action.payload?.date
      };
    },
    createActivityFailure(state, action: PayloadAction<string | unknown>) {
      state.loading = false;
      state.error = action.payload;
    },
    updateActivityRequest(state, action: PayloadAction<Activity>) {
      state.loading = true;
      state.activity = action.payload;
    },
    updateActivitySuccess(state, action: PayloadAction<Activity>) {
      state.loading = false;
      state.editMode = false;
      state.activities = sortActivitiesByDate(
        state.activities.map((activity) =>
          activity.id === action.payload.id ? action.payload : activity
        )
      );
      state.selectedActivity = action.payload;
    },
    updateActivityFailure(state, action: PayloadAction<string | unknown>) {
      state.loading = false;
      state.error = action.payload;
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
      state.error = action.payload;
    },
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
} = activitySlice.actions;

export default activitySlice.reducer;
