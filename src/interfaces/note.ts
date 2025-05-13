import { User } from "./user";

export interface Note extends Document {
// id: string;
text: string;
date: Date;
_createdBy: User["id"];
}