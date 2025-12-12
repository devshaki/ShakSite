import { Component, OnInit, OnDestroy, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScheduleService } from '../../services/schedule.service';
import { ExamsService } from '../../services/exams.service';
import { TasksService } from '../../services/tasks.service';
import { TimeSlot } from '../../models/schedule.models';
import { ExamDate, Task } from '../../models/content.models';

@Component({
  selector: 'app-schedule-grid',
  imports: [CommonModule],
  templateUrl: './schedule-grid.html',
  styleUrl: './schedule-grid.scss',
})
export class ScheduleGrid implements OnInit, OnDestroy {
  private intervalId?: number;

  schedule: any;
  selectedGroup: any;
  showOnlyToday: any;
  currentTime: any;
  
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
    
    this.currentTime = computed(() => {
      const period = this.scheduleService.getCurrentPeriod();
      if (!period) return null;
      return {
        day: period.day,
        timeSlot: period.timeSlot,
      };
    });

    this.loadExamsAndTasks();
  }

  ngOnInit(): void {
    // Force update every minute to refresh current time highlighting
    this.intervalId = window.setInterval(() => {
      this.scheduleService.selectedGroup.set(this.scheduleService.selectedGroup());
      this.loadExamsAndTasks(); // Refresh data
    }, 60000);
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  loadExamsAndTasks(): void {
    // Load exams from backend
    this.examsService.getAll().subscribe({
      next: (allExams) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // Get exams in the next 30 days
        const thirtyDaysFromNow = new Date(today);
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
        
        const upcoming = allExams
          .filter(exam => {
            const examDate = new Date(exam.date);
            examDate.setHours(0, 0, 0, 0);
            return examDate >= today && examDate <= thirtyDaysFromNow;
          })
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
          .slice(0, 5); // Show max 5 exams
        
        this.upcomingExams.set(upcoming);
      },
      error: (err) => console.error('Failed to load exams:', err)
    });

    // Load tasks from backend
    this.tasksService.getAll().subscribe({
      next: (allTasks) => {
        const incomplete = allTasks
          .filter(task => !task.completed)
          .sort((a, b) => {
            // Sort by priority first, then by due date
            const priorityOrder = { high: 0, medium: 1, low: 2 };
            const aPriority = priorityOrder[a.priority || 'medium'];
            const bPriority = priorityOrder[b.priority || 'medium'];
            
            if (aPriority !== bPriority) {
              return aPriority - bPriority;
            }
            
            return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
          })
          .slice(0, 5); // Show max 5 tasks
        
        this.incompleteTasks.set(incomplete);
      },
      error: (err) => console.error('Failed to load tasks:', err)
    });
  }

  getTimeSlotsForDay(dayIndex: number): TimeSlot[] {
    const day = this.schedule()[dayIndex];
    if (!day) return [];
    return day.slots || [];
  }

  isCurrentSlot(dayName: string, slot: TimeSlot): boolean {
    const current = this.currentTime();
    if (!current) return false;
    return current.day === dayName && 
           current.timeSlot.start === slot.start && 
           current.timeSlot.end === slot.end;
  }

  getSlotColor(slot: any): string {
    return slot.classInfo?.color || 'transparent';
  }

  getSlotDetails(slot: any): string {
    const parts = [];
    if (slot.room) parts.push(`חדר ${slot.room}`);
    if (slot.classInfo?.teacher) parts.push(slot.classInfo.teacher);
    if (slot.notes) parts.push(slot.notes);
    return parts.join(' • ');
  }
}
