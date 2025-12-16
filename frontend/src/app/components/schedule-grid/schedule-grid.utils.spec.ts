import { describe, expect, it } from 'vitest';
import {
  compareTasks,
  getDateValue,
  isWithinDateRange,
  SCHEDULE_REFRESH_INTERVAL_MS,
  UPCOMING_EXAM_LOOKAHEAD_DAYS,
} from './schedule-grid.utils';
import { Task } from '../../models/content.models';

const baseTask = (overrides: Partial<Task>): Task => ({
  id: '1',
  title: 'task',
  dueDate: '2024-01-01',
  completed: false,
  priority: 'medium',
  ...overrides,
});

describe('schedule-grid.utils', () => {
  it('exposes stable interval constants', () => {
    expect(SCHEDULE_REFRESH_INTERVAL_MS).toBe(60_000);
    expect(UPCOMING_EXAM_LOOKAHEAD_DAYS).toBe(30);
  });

  it('orders tasks by priority then due date', () => {
    const high = baseTask({ id: 'a', priority: 'high' });
    const mediumEarly = baseTask({ id: 'b', dueDate: '2024-01-01', priority: 'medium' });
    const mediumLate = baseTask({ id: 'c', dueDate: '2024-02-01', priority: 'medium' });

    expect(compareTasks(high, mediumEarly)).toBeLessThan(0);
    expect(compareTasks(mediumEarly, mediumLate)).toBeLessThan(0);
  });

  it('treats missing or invalid dates as infinity', () => {
    expect(getDateValue('')).toBe(Number.POSITIVE_INFINITY);
    expect(getDateValue('not-a-date')).toBe(Number.POSITIVE_INFINITY);
  });

  it('detects date range inclusively', () => {
    const start = new Date('2024-01-01');
    const end = new Date('2024-01-10');
    const inside = new Date('2024-01-05').getTime();
    const outside = new Date('2024-02-01').getTime();

    expect(isWithinDateRange(inside, start, end)).toBe(true);
    expect(isWithinDateRange(outside, start, end)).toBe(false);
  });
});
