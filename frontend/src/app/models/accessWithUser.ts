import { User } from "./user.model";


export interface AccessWithUser {
  _id: string;              // ID de l'accès
  role: 'admin' | 'chef_admin';
  user: User; 
  showDetails: boolean;             
}