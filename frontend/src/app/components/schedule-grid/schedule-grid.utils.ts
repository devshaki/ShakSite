import { Task } from '../../models/content.models';
import { TimeSlot } from '../../models/schedule.models';

export const REFRESH_INTERVAL_MS = 60_000;
export const UPCOMING_EXAM_LOOKAHEAD_DAYS = 30;
export const MAX_ITEMS_TO_DISPLAY = 5;
export const DEFAULT_TASK_PRIORITY: NonNullable<Task['priority']> = 'medium';

const TASK_PRIORITY_ORDER: Record<NonNullable<Task['priority']>, number> = {
  high: 0,
  medium: 1,
  low: 2,
};

export function getStartOfToday(): Date {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

export function addDays(base: Date, daysToAdd: number): Date {
  const result = new Date(base);
  result.setDate(result.getDate() + daysToAdd);
  return result;
}

export function isWithinDateRange(date: Date, start: Date, end: Date): boolean {
  const currentDate = new Date(date);
  currentDate.setHours(0, 0, 0, 0);
  return currentDate >= start && currentDate <= end;
}

export function compareTasks(firstTask: Task, secondTask: Task): number {
  const priorityDifference =
    getPriorityRank(firstTask) - getPriorityRank(secondTask);
  if (priorityDifference !== 0) {
    return priorityDifference;
  }

  return getDueDateValue(firstTask) - getDueDateValue(secondTask);
}

function getPriorityRank(task: Task): number {
  return TASK_PRIORITY_ORDER[task.priority ?? DEFAULT_TASK_PRIORITY];
}

function getDueDateValue(task: Task): number {
  const parsed = new Date(task.dueDate ?? '').getTime();
  return Number.isNaN(parsed) ? Number.POSITIVE_INFINITY : parsed;
}
