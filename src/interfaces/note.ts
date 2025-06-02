import { User } from './user';

export interface Note extends Document {
  text: string;
  date: Date;
  _createdBy: User['id'];
}
