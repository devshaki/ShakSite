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
import {
  SCHEDULE_REFRESH_INTERVAL_MS,
  UPCOMING_EXAM_LOOKAHEAD_DAYS,
  MAX_ITEMS_TO_DISPLAY,
  compareTasks,
  addDays,
  getStartOfToday,
  isWithinDateRange,
  getDateValue,
} from './schedule-grid.utils';

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
    this.intervalId = window.setInterval(() => {
      this.scheduleService.selectedGroup.set(this.scheduleService.selectedGroup());
      this.refreshUpcomingItems(); // Refresh data
    }, SCHEDULE_REFRESH_INTERVAL_MS);
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  refreshUpcomingItems(): void {
    this.examsService.getAll().subscribe({
      next: (allExams) => {
        const today = getStartOfToday();
        const upcomingWindowEnd = addDays(today, UPCOMING_EXAM_LOOKAHEAD_DAYS);

        const upcoming = allExams
          .reduce(
            (acc, exam) => {
              if (!exam.date.trim()) {
                return acc;
              }

              const timestamp = getDateValue(exam.date);
              if (
                !Number.isFinite(timestamp) ||
                !isWithinDateRange(timestamp, today, upcomingWindowEnd)
              ) {
                return acc;
              }

              acc.push({ exam, timestamp });
              return acc;
            },
            [] as { exam: ExamDate; timestamp: number }[]
          )
          .sort((first, second) => first.timestamp - second.timestamp)
          .map(({ exam }) => exam)
          .slice(0, MAX_ITEMS_TO_DISPLAY);

        this.upcomingExams.set(upcoming);
      },
      error: (err) => console.error('Failed to load exams:', err),
    });

    this.tasksService.getAll().subscribe({
      next: (allTasks) => {
        const incomplete = allTasks
          .filter((task) => !task.completed)
          .sort((firstTask, secondTask) => compareTasks(firstTask, secondTask))
          .slice(0, MAX_ITEMS_TO_DISPLAY);

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
}
