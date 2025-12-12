export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate: string;
  subject?: string;
  completed: boolean;
  priority?: 'low' | 'medium' | 'high';
}
