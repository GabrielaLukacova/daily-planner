import { User } from './user';

export interface Activity extends Document {
  title: string;
  description: string;
  date: Date;
  startTime: string;
  endTime: string;
  place: string;
  isRepeating: boolean;
  repeating?: repeatingType;
  _createdBy: User['id'];
}

export enum repeatingType {
  None = 'None',
  Daily = 'Daily',
  Weekly = 'Weekly',
  Monthly = 'Monthly',
}
