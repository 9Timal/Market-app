// models/login-response.model.ts
import { User } from './user.model';

export interface LoginResponse {
  message: string;
  token: string;
  user: User;
}
