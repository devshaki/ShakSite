import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExamDate, Task } from '../../models/content.models';
import { ExamsService } from '../../services/exams.service';
import { TasksService } from '../../services/tasks.service';
import { NotificationService } from '../../services/notification.service';
import { ValidationService } from '../../services/validation.service';
import { FilterPipe } from '../../pipes/filter.pipe';

@Component({
  selector: 'app-admin-content',
  standalone: true,
  imports: [CommonModule, FormsModule, FilterPipe],
  templateUrl: './admin-content.html',
  styleUrl: './admin-content.scss',
})
export class AdminContent {
  exams = signal<ExamDate[]>([]);
  tasks = signal<Task[]>([]);

  examSearchTerm = signal('');
  taskSearchTerm = signal('');
  taskFilterStatus = signal<'all' | 'incomplete' | 'completed'>('all');

  // Exam form
  newExamSubject = signal('');
  newExamDate = signal('');
  newExamTime = signal('');
  newExamRoom = signal('');
  newExamNotes = signal('');

  // Task form
  newTaskTitle = signal('');
  newTaskDescription = signal('');
  newTaskDueDate = signal('');
  newTaskSubject = signal('');
  newTaskPriority = signal<'low' | 'medium' | 'high'>('medium');

  editingExamId = signal<string | null>(null);
  editingTaskId = signal<string | null>(null);

  constructor(
    private examsService: ExamsService,
    private tasksService: TasksService,
    private notificationService: NotificationService,
    private validationService: ValidationService
  ) {
    this.loadData();
  }

  loadData() {
    this.examsService.getAll().subscribe({
      next: (exams) => this.exams.set(exams),
      error: (err) => {
        console.error('Failed to load exams:', err);
        this.notificationService.error('טעינת מבחנים נכשלה');
      },
    });

    this.tasksService.getAll().subscribe({
      next: (tasks) => this.tasks.set(tasks),
      error: (err) => {
        console.error('Failed to load tasks:', err);
        this.notificationService.error('טעינת משימות נכשלה');
      },
    });
  }

  // Exam methods
  addExam() {
    const subject = this.newExamSubject().trim();
    const date = this.newExamDate().trim();
    const time = this.newExamTime().trim();
    const room = this.newExamRoom().trim();

    const validation = this.validationService.validateExamForm(subject, date, time, room);
    if (!validation.valid) {
      this.notificationService.warning(validation.error || 'שגיאת ולידציה');
      return;
    }

    const newExam = {
      subject,
      date,
      time: time || undefined,
      room: room || undefined,
      notes: this.newExamNotes().trim() || undefined,
    };

    this.examsService.create(newExam).subscribe({
      next: (exam) => {
        this.exams.update((exams) => [...exams, exam]);
        this.clearExamForm();
        this.notificationService.success('מבחן נוסף בהצלחה');
      },
      error: (err) => {
        console.error('Failed to add exam:', err);
        this.notificationService.error('הוספת מבחן נכשלה');
      },
    });
  }

  editExam(exam: ExamDate) {
    this.editingExamId.set(exam.id);
    this.newExamSubject.set(exam.subject);
    this.newExamDate.set(exam.date);
    this.newExamTime.set(exam.time || '');
    this.newExamRoom.set(exam.room || '');
    this.newExamNotes.set(exam.notes || '');
  }

  updateExam() {
    const examId = this.editingExamId();
    if (!examId) return;

    const updatedData = {
      subject: this.newExamSubject().trim(),
      date: this.newExamDate().trim(),
      time: this.newExamTime().trim() || undefined,
      room: this.newExamRoom().trim() || undefined,
      notes: this.newExamNotes().trim() || undefined,
    };

    this.examsService.update(examId, updatedData).subscribe({
      next: (exam) => {
        this.exams.update((exams) => exams.map((e) => (e.id === examId ? exam : e)));
        this.clearExamForm();
        this.notificationService.success('מבחן עודכן בהצלחה');
      },
      error: (err) => {
        console.error('Failed to update exam:', err);
        this.notificationService.error('עדכון מבחן נכשל');
      },
    });
  }

  deleteExam(id: string) {
    this.examsService.delete(id).subscribe({
      next: () => {
        this.exams.update((exams) => exams.filter((e) => e.id !== id));
        this.notificationService.success('מבחן נמחק בהצלחה');
      },
      error: (err) => {
        console.error('Failed to delete exam:', err);
        this.notificationService.error('מחיקת מבחן נכשלה');
      },
    });
  }

  clearExamForm() {
    this.editingExamId.set(null);
    this.newExamSubject.set('');
    this.newExamDate.set('');
    this.newExamTime.set('');
    this.newExamRoom.set('');
    this.newExamNotes.set('');
  }

  // Task methods
  addTask() {
    const title = this.newTaskTitle().trim();
    const dueDate = this.newTaskDueDate().trim();
    const description = this.newTaskDescription().trim();

    const validation = this.validationService.validateTaskForm(title, dueDate, description);
    if (!validation.valid) {
      this.notificationService.warning(validation.error || 'שגיאת ולידציה');
      return;
    }

    const newTask = {
      title,
      dueDate,
      description: description || undefined,
      subject: this.newTaskSubject().trim() || undefined,
      priority: this.newTaskPriority(),
      completed: false,
    };

    this.tasksService.create(newTask).subscribe({
      next: (task) => {
        this.tasks.update((tasks) => [...tasks, task]);
        this.clearTaskForm();
        this.notificationService.success('משימה נוספה בהצלחה');
      },
      error: (err) => {
        console.error('Failed to add task:', err);
        this.notificationService.error('הוספת משימה נכשלה');
      },
    });
  }

  editTask(task: Task) {
    this.editingTaskId.set(task.id);
    this.newTaskTitle.set(task.title);
    this.newTaskDescription.set(task.description || '');
    this.newTaskDueDate.set(task.dueDate);
    this.newTaskSubject.set(task.subject || '');
    this.newTaskPriority.set(task.priority || 'medium');
  }

  updateTask() {
    const taskId = this.editingTaskId();
    if (!taskId) return;

    const updatedData = {
      title: this.newTaskTitle().trim(),
      description: this.newTaskDescription().trim() || undefined,
      dueDate: this.newTaskDueDate().trim(),
      subject: this.newTaskSubject().trim() || undefined,
      priority: this.newTaskPriority(),
    };

    this.tasksService.update(taskId, updatedData).subscribe({
      next: (task) => {
        this.tasks.update((tasks) => tasks.map((t) => (t.id === taskId ? task : t)));
        this.clearTaskForm();
        this.notificationService.success('משימה עודכנה בהצלחה');
      },
      error: (err) => {
        console.error('Failed to update task:', err);
        this.notificationService.error('עדכון משימה נכשל');
      },
    });
  }

  toggleTaskCompletion(id: string) {
    const task = this.tasks().find((t) => t.id === id);
    if (!task) return;

    this.tasksService.update(id, { completed: !task.completed }).subscribe({
      next: (updatedTask) => {
        this.tasks.update((tasks) => tasks.map((t) => (t.id === id ? updatedTask : t)));
        const status = updatedTask.completed ? 'הושלמה' : 'סומנה כלא הושלמה';
        this.notificationService.success(`משימה ${status}`);
      },
      error: (err) => {
        console.error('Failed to toggle task:', err);
        this.notificationService.error('שינוי סטטוס משימה נכשל');
      },
    });
  }

  deleteTask(id: string) {
    this.tasksService.delete(id).subscribe({
      next: () => {
        this.tasks.update((tasks) => tasks.filter((t) => t.id !== id));
        this.notificationService.success('משימה נמחקה בהצלחה');
      },
      error: (err) => {
        console.error('Failed to delete task:', err);
        this.notificationService.error('מחיקת משימה נכשלה');
      },
    });
  }

  clearTaskForm() {
    this.editingTaskId.set(null);
    this.newTaskTitle.set('');
    this.newTaskDescription.set('');
    this.newTaskDueDate.set('');
    this.newTaskSubject.set('');
    this.newTaskPriority.set('medium');
  }

  getFilteredExams(): ExamDate[] {
    let filtered = [...this.exams()];

    const searchTerm = this.examSearchTerm().toLowerCase();
    if (searchTerm) {
      filtered = filtered.filter(exam =>
        exam.subject.toLowerCase().includes(searchTerm) ||
        exam.room?.toLowerCase().includes(searchTerm) ||
        exam.notes?.toLowerCase().includes(searchTerm)
      );
    }

    return filtered.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }

  getFilteredTasks(): Task[] {
    let filtered = [...this.tasks()];

    const status = this.taskFilterStatus();
    if (status === 'incomplete') {
      filtered = filtered.filter(t => !t.completed);
    } else if (status === 'completed') {
      filtered = filtered.filter(t => t.completed);
    }

    const searchTerm = this.taskSearchTerm().toLowerCase();
    if (searchTerm) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchTerm) ||
        task.description?.toLowerCase().includes(searchTerm) ||
        task.subject?.toLowerCase().includes(searchTerm)
      );
    }

    return filtered.sort((a, b) => {
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });
  }

  getSortedExams(): ExamDate[] {
    return [...this.exams()].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }

  getSortedTasks(): Task[] {
    return [...this.tasks()].sort((a, b) => {
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });
  }
}
