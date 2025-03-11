import { User } from "./User";

export interface IProfile {
  username: string;
  displayName: string |undefined;
  image?: string;
  bio?: string;
  photos?: Photo[];
}

export class Profile implements IProfile {
  constructor(user: User) {
    this.username = user.username;
    this.displayName = user.displayName;
    this.image = user.image;
  }

  username: string;
  displayName: string |undefined;
  image?: string;
  bio?: string;
  photos?: Photo[] | undefined;
}

export interface Photo {
  id: string;
  url: string;
  isMain: boolean;
}
