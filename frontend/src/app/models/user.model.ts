export interface User {
  _id: any;
  id: string;
  name: string;
  lastname: string;
  email: string;
  role: 'user' | 'super_admin';
  createdAt: Date; // ou Date
}