import { ExamDate, Task } from '../models/content.models';

export const EXAM_DATES: ExamDate[] = [
  {
    id: '1',
    subject: 'אלגברה לינארית',
    classId: 'ALGB',
    date: '2025-01-15',
    time: '09:00',
    room: 'אולם 1',
    notes: 'מבחן סיום - חומר מלא'
  },
  {
    id: '2',
    subject: 'מערכות הפעלה',
    classId: 'SYS',
    date: '2025-01-20',
    time: '10:00',
    notes: 'מועד א'
  }
];

export const TASKS: Task[] = [
  {
    id: '1',
    title: 'עבודה 3 באלגברה',
    subject: 'אלגברה לינארית',
    description: 'תרגילים 5.1-5.8',
    dueDate: '2025-12-20',
    completed: false,
    priority: 'high'
  },
  {
    id: '2',
    title: 'פרויקט אינטרנט',
    subject: 'אינטרנט הדברים',
    description: 'השלמת חיישן טמפרטורה',
    dueDate: '2025-12-25',
    completed: false,
    priority: 'medium'
  }
];
