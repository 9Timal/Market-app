import { Store } from "./store.model"
import { User } from "./user.model"

export interface Myinvitation{
    
    id: string;
    email: string;
    store: Store;
    role: string;
    status: string;
    created_at:Date;
    expires_at: Date;
    created_by: User;
}
