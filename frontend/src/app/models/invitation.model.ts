import { User } from "./user.model";

export interface invitation{
  _id: string;
  email: string;
  role: string;
  status:string;
  created_by: User;
  created_at: Date;
  expires_at: Date;
}