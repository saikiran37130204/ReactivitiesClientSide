export interface ChatComment {
  id: number;
  createdAt: string | Date;
  body: string;
  username: string;
  displayName: string;
  image: string;
}
