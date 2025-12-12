import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExamDate, Task } from '../../models/content.models';
import { ExamsService } from '../../services/exams.service';
import { TasksService } from '../../services/tasks.service';

@Component({
  selector: 'app-admin-content',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-content.html',
  styleUrl: './admin-content.scss'
})
export class AdminContent {
  exams = signal<ExamDate[]>([]);
  tasks = signal<Task[]>([]);
  
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
    private tasksService: TasksService
  ) {
    this.loadData();
  }

  loadData() {
    this.examsService.getAll().subscribe({
      next: (exams) => this.exams.set(exams),
      error: (err) => console.error('Failed to load exams:', err)
    });

    this.tasksService.getAll().subscribe({
      next: (tasks) => this.tasks.set(tasks),
      error: (err) => console.error('Failed to load tasks:', err)
    });
  }

  // Exam methods
  addExam() {
    const subject = this.newExamSubject().trim();
    const date = this.newExamDate().trim();
    
    if (!subject || !date) return;

    const newExam = {
      subject,
      date,
      time: this.newExamTime().trim() || undefined,
      room: this.newExamRoom().trim() || undefined,
      notes: this.newExamNotes().trim() || undefined,
    };

    this.examsService.create(newExam).subscribe({
      next: (exam) => {
        this.exams.update(exams => [...exams, exam]);
        this.clearExamForm();
      },
      error: (err) => console.error('Failed to add exam:', err)
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
        this.exams.update(exams => 
          exams.map(e => e.id === examId ? exam : e)
        );
        this.clearExamForm();
      },
      error: (err) => console.error('Failed to update exam:', err)
    });
  }

  deleteExam(id: string) {
    this.examsService.delete(id).subscribe({
      next: () => {
        this.exams.update(exams => exams.filter(e => e.id !== id));
      },
      error: (err) => console.error('Failed to delete exam:', err)
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
    
    if (!title || !dueDate) return;

    const newTask = {
      title,
      dueDate,
      description: this.newTaskDescription().trim() || undefined,
      subject: this.newTaskSubject().trim() || undefined,
      priority: this.newTaskPriority(),
      completed: false,
    };

    this.tasksService.create(newTask).subscribe({
      next: (task) => {
        this.tasks.update(tasks => [...tasks, task]);
        this.clearTaskForm();
      },
      error: (err) => console.error('Failed to add task:', err)
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
        this.tasks.update(tasks => 
          tasks.map(t => t.id === taskId ? task : t)
        );
        this.clearTaskForm();
      },
      error: (err) => console.error('Failed to update task:', err)
    });
  }

  toggleTaskCompletion(id: string) {
    const task = this.tasks().find(t => t.id === id);
    if (!task) return;

    this.tasksService.update(id, { completed: !task.completed }).subscribe({
      next: (updatedTask) => {
        this.tasks.update(tasks => 
          tasks.map(t => t.id === id ? updatedTask : t)
        );
      },
      error: (err) => console.error('Failed to toggle task:', err)
    });
  }

  deleteTask(id: string) {
    this.tasksService.delete(id).subscribe({
      next: () => {
        this.tasks.update(tasks => tasks.filter(t => t.id !== id));
      },
      error: (err) => console.error('Failed to delete task:', err)
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

  getSortedExams(): ExamDate[] {
    return [...this.exams()].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }

  getSortedTasks(): Task[] {
    return [...this.tasks()].sort((a, b) => {
      // Incomplete tasks first
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      // Then by due date
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });
  }
}
