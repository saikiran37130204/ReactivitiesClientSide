import { Profile } from "./profile";

export interface IActivity {
  id: string;
  title: string;
  date: string| null;
  description: string;
  category: string;
  city: string;
  venue: string;
  hostUsername: string;
  isCancelled: boolean;
  isGoing: boolean;
  isHost: boolean;
  host?: Profile;
  attendees: Profile[];
}
export class Activity implements IActivity {
  constructor(init: ActivityFormValues) {
    this.id = init.id!;
    this.title = init.title;
    this.date = init.date;
    this.description = init.description;
    this.category = init.category;
    this.venue = init.venue;
    this.city = init.city;
    this.hostUsername = ""; // Default value
    this.isCancelled = false; // Default value
    this.isGoing = false; // Default value
    this.isHost = false; // Default value
    this.attendees = []; // Initialize attendees as an empty array
  }

  id: string;
  title: string;
  date: string | null;
  description: string;
  category: string;
  city: string;
  venue: string;
  hostUsername: string;
  isCancelled: boolean;
  isGoing: boolean;
  isHost: boolean;
  host?: Profile;
  attendees: Profile[]=[];
}

export class ActivityFormValues {
  id: string = "";
  title: string = "";
  category: string = "";
  description: string = "";
  date: string | null = null;
  city: string = "";
  venue: string = "";

  constructor(activity?: ActivityFormValues) {
    if (activity) {
      this.id = activity.id;
      this.title = activity.title;
      this.category = activity.category;
      this.description = activity.description;
      this.date = activity.date;
      this.venue = activity.venue;
      this.city = activity.city;
    }
  }
}
