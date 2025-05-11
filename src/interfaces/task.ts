
export interface Task extends Document {
    id: string;
    userId: string;
    title: string;
    isCompleted: boolean;
    highPriority: boolean;
}