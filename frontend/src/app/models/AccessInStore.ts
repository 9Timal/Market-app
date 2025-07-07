
import { User } from "./user.model";

export interface AccessInStore{
    id: string;
    store: string;
    user:User;
    role: string;
}