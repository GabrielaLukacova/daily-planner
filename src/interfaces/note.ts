import { User } from "./user";

export interface Note extends Document {
text: string;
_createdBy: User["id"];
}