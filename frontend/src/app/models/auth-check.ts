import { User } from './user.model';

export interface AuthCheckResponse {
  message: string;
  user: User;
}