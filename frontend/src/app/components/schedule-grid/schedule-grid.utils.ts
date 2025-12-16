import { Task } from '../../models/content.models';

export const SCHEDULE_REFRESH_INTERVAL_MS = 60_000;
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

/**
 * Checks whether the provided timestamp falls on or between the supplied start/end dates.
 * Comparison is done at day precision (hours/minutes zeroed).
 */
export function isWithinDateRange(
  dateToCheckMs: number,
  start: Date,
  end: Date
): boolean {
  const currentDate = new Date(dateToCheckMs);
  currentDate.setHours(0, 0, 0, 0);
  return currentDate >= start && currentDate <= end;
}

/**
 * Orders tasks by priority (high -> low) and then by due date (earliest first).
 * Invalid or empty dates are treated as infinitely far in the future.
 */
export function compareTasks(firstTask: Task, secondTask: Task): number {
  const priorityDifference =
    getPriorityRank(firstTask) - getPriorityRank(secondTask);
  if (priorityDifference !== 0) {
    return priorityDifference;
  }

  return getDateValue(firstTask.dueDate) - getDateValue(secondTask.dueDate);
}

function getPriorityRank(task: Task): number {
  return TASK_PRIORITY_ORDER[task.priority ?? DEFAULT_TASK_PRIORITY];
}

/**
 * Safely converts a date input to a numeric timestamp.
 * Returns Number.POSITIVE_INFINITY for invalid or empty values.
 */
export function getDateValue(
  dateInput: string | Date | null | undefined
): number {
  const normalized =
    typeof dateInput === 'string' ? dateInput.trim() : dateInput;

  if (!normalized) {
    return Number.POSITIVE_INFINITY;
  }

  const parsed = new Date(normalized).getTime();
  return Number.isNaN(parsed) ? Number.POSITIVE_INFINITY : parsed;
}
