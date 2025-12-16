import {
  Component,
  OnInit,
  OnDestroy,
  computed,
  signal,
  Signal,
  WritableSignal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScheduleService } from '../../services/schedule.service';
import { ExamsService } from '../../services/exams.service';
import { TasksService } from '../../services/tasks.service';
import { Group, TimeSlot } from '../../models/schedule.models';
import { ExamDate, Task } from '../../models/content.models';
import { DisplayDay, DisplaySlot } from '../../services/schedule.service';

const REFRESH_INTERVAL_MS = 60_000;
const UPCOMING_EXAM_LOOKAHEAD_DAYS = 30;
const MAX_ITEMS_TO_DISPLAY = 5;
const DEFAULT_TASK_PRIORITY: NonNullable<Task['priority']> = 'medium';
const TASK_PRIORITY_ORDER: Record<NonNullable<Task['priority']>, number> = {
  high: 0,
  medium: 1,
  low: 2,
};

type CurrentSlotContext = {
  day: string;
  timeSlot: TimeSlot;
};

@Component({
  selector: 'app-schedule-grid',
  imports: [CommonModule],
  templateUrl: './schedule-grid.html',
  styleUrl: './schedule-grid.scss',
})
export class ScheduleGrid implements OnInit, OnDestroy {
  private intervalId?: number;

  schedule: Signal<DisplayDay[]>;
  selectedGroup: WritableSignal<Group>;
  showOnlyToday: Signal<boolean>;
  currentPeriod: Signal<CurrentSlotContext | null>;

  upcomingExams = signal<ExamDate[]>([]);
  incompleteTasks = signal<Task[]>([]);

  constructor(
    public scheduleService: ScheduleService,
    private examsService: ExamsService,
    private tasksService: TasksService
  ) {
    this.schedule = this.scheduleService.schedule;
    this.selectedGroup = this.scheduleService.selectedGroup;
    this.showOnlyToday = this.scheduleService.showOnlyToday;

    this.currentPeriod = computed<CurrentSlotContext | null>(() => {
      const period = this.scheduleService.getCurrentPeriod();
      if (!period) return null;
      return {
        day: period.day,
        timeSlot: period.timeSlot,
      };
    });

    this.refreshUpcomingItems();
  }

  ngOnInit(): void {
    // Force update every minute to refresh current time highlighting
    this.intervalId = window.setInterval(() => {
      this.scheduleService.selectedGroup.set(this.scheduleService.selectedGroup());
      this.refreshUpcomingItems(); // Refresh data
    }, REFRESH_INTERVAL_MS);
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  refreshUpcomingItems(): void {
    // Load exams from backend
    this.examsService.getAll().subscribe({
      next: (allExams) => {
        const today = this.getStartOfToday();
        const upcomingWindowEnd = this.addDays(today, UPCOMING_EXAM_LOOKAHEAD_DAYS);

        const upcoming = allExams
          .filter((exam) => this.isWithinDateRange(exam.date, today, upcomingWindowEnd))
          .sort((firstExam, secondExam) =>
            new Date(firstExam.date).getTime() - new Date(secondExam.date).getTime()
          )
          .slice(0, MAX_ITEMS_TO_DISPLAY); // Show max 5 exams

        this.upcomingExams.set(upcoming);
      },
      error: (err) => console.error('Failed to load exams:', err),
    });

    // Load tasks from backend
    this.tasksService.getAll().subscribe({
      next: (allTasks) => {
        const incomplete = allTasks
          .filter((task) => !task.completed)
          .sort((firstTask, secondTask) => this.compareTasks(firstTask, secondTask))
          .slice(0, MAX_ITEMS_TO_DISPLAY); // Show max 5 tasks

        this.incompleteTasks.set(incomplete);
      },
      error: (err) => console.error('Failed to load tasks:', err),
    });
  }

  getDisplaySlotsForDay(dayIndex: number): DisplaySlot[] {
    const day = this.schedule()[dayIndex];
    if (!day) return [];
    return day.slots || [];
  }

  isCurrentSlot(dayName: string, slot: DisplaySlot): boolean {
    const current = this.currentPeriod();
    if (!current) return false;
    return (
      current.day === dayName &&
      current.timeSlot.start === slot.start &&
      current.timeSlot.end === slot.end
    );
  }

  getSlotColor(slot: DisplaySlot): string {
    return slot.classInfo?.color || 'transparent';
  }

  getSlotDetails(slot: DisplaySlot): string {
    const parts = [];
    if (slot.room) parts.push(`חדר ${slot.room}`);
    if (slot.classInfo?.teacher) parts.push(slot.classInfo.teacher);
    if (slot.notes) parts.push(slot.notes);
    return parts.join(' • ');
  }

  private getStartOfToday(): Date {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  }

  private addDays(base: Date, daysToAdd: number): Date {
    const result = new Date(base);
    result.setDate(result.getDate() + daysToAdd);
    return result;
  }

  private isWithinDateRange(date: string, start: Date, end: Date): boolean {
    const currentDate = new Date(date);
    currentDate.setHours(0, 0, 0, 0);
    return currentDate >= start && currentDate <= end;
  }

  private compareTasks(firstTask: Task, secondTask: Task): number {
    const priorityDifference =
      this.getPriorityRank(firstTask) - this.getPriorityRank(secondTask);
    if (priorityDifference !== 0) {
      return priorityDifference;
    }

    return (
      new Date(firstTask.dueDate).getTime() - new Date(secondTask.dueDate).getTime()
    );
  }

  private getPriorityRank(task: Task): number {
    return TASK_PRIORITY_ORDER[task.priority ?? DEFAULT_TASK_PRIORITY];
  }
}
