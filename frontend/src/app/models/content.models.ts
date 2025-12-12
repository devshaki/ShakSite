export interface ExamDate {
  id: string;
  subject: string;
  date: string; // ISO date string
  time?: string; // HH:MM
  room?: string;
  notes?: string;
  classId?: string; // reference to timetable class
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate: string; // ISO date string
  subject?: string;
  completed: boolean;
  priority?: 'low' | 'medium' | 'high';
}

export interface Quote {
  id: string;
  text: string;
  author?: string;
  addedDate: string; // ISO date string
}
