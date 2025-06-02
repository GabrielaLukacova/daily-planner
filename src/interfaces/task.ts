import { User } from './user';

export interface Task extends Document {
  userId: string;
  title: string;
  isCompleted: boolean;
  highPriority: boolean;
  _createdBy: User['id'];
}
