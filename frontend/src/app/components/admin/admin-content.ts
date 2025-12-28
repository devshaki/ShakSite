import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExamDate, Task } from '../../models/content.models';
import { ExamsService } from '../../services/exams.service';
import { TasksService } from '../../services/tasks.service';
import { NotificationService } from '../../services/notification.service';
import { ValidationService } from '../../services/validation.service';
import { FormBuilder } from '../form-builder/form-builder';
import { FormConfig, FormSubmitEvent } from '../../models/form-builder.models';

@Component({
  selector: 'app-admin-content',
  standalone: true,
  imports: [CommonModule, FormsModule, FormBuilder],
  templateUrl: './admin-content.html',
  styleUrl: './admin-content.scss',
})
export class AdminContent {
  exams = signal<ExamDate[]>([]);
  tasks = signal<Task[]>([]);

  examSearchTerm = signal('');
  taskSearchTerm = signal('');
  taskFilterStatus = signal<'all' | 'incomplete' | 'completed'>('all');

  editingExamId = signal<string | null>(null);
  editingTaskId = signal<string | null>(null);

  // Form configurations
  examFormConfig = signal<FormConfig>({
    title: 'Exams Management',
    titleIcon: '📝',
    colorTheme: 'purple',
    submitText: 'Add Exam',
    sections: [
      {
        label: 'Exam Details',
        icon: '📋',
        fields: [
          {
            name: 'subject',
            label: 'Subject',
            type: 'text',
            placeholder: 'Enter subject name...',
            required: true,
            icon: '📚'
          },
          {
            name: 'date',
            label: 'Exam Date',
            type: 'date',
            required: true,
            icon: '📅'
          },
          {
            name: 'time',
            label: 'Exam Time',
            type: 'time',
            icon: '⏰',
            hint: 'Optional'
          },
          {
            name: 'room',
            label: 'Room',
            type: 'text',
            placeholder: 'Enter room number...',
            icon: '🚪',
            hint: 'Optional'
          },
          {
            name: 'notes',
            label: 'Notes',
            type: 'textarea',
            placeholder: 'Additional notes...',
            icon: '📝',
            rows: 3,
            hint: 'Optional'
          }
        ]
      }
    ]
  });

  taskFormConfig = signal<FormConfig>({
    title: 'Tasks Management',
    titleIcon: '✅',
    colorTheme: 'green',
    submitText: 'Add Task',
    sections: [
      {
        label: 'Task Information',
        icon: '📌',
        fields: [
          {
            name: 'title',
            label: 'Task Title',
            type: 'text',
            placeholder: 'Enter task title...',
            required: true,
            icon: '✏️'
          },
          {
            name: 'description',
            label: 'Description',
            type: 'textarea',
            placeholder: 'Describe the task...',
            icon: '📄',
            rows: 4,
            hint: 'Optional'
          },
          {
            name: 'dueDate',
            label: 'Due Date',
            type: 'date',
            icon: '📅',
            hint: 'Optional'
          },
          {
            name: 'subject',
            label: 'Subject',
            type: 'text',
            placeholder: 'Related subject...',
            icon: '📚',
            hint: 'Optional'
          },
          {
            name: 'priority',
            label: 'Priority',
            type: 'select',
            icon: '⚡',
            required: true,
            value: 'medium',
            options: [
              { label: 'Low', value: 'low' },
              { label: 'Medium', value: 'medium' },
              { label: 'High', value: 'high' }
            ]
          }
        ]
      }
    ]
  });

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
  handleExamSubmit(event: FormSubmitEvent) {
    const data = event.data;
    
    const validation = this.validationService.validateExamForm(
      data['subject'], 
      data['date'], 
      data['time'], 
      data['room']
    );
    
    if (!validation.valid) {
      this.notificationService.warning(validation.error || 'שגיאת ולידציה');
      return;
    }

    const examData = {
      subject: data['subject'],
      date: data['date'],
      time: data['time'] || undefined,
      room: data['room'] || undefined,
      notes: data['notes'] || undefined,
    };

    if (this.editingExamId()) {
      this.updateExam(examData);
    } else {
      this.addExam(examData);
    }
  }

  addExam(examData: any) {
    this.examsService.create(examData).subscribe({
      next: (exam) => {
        this.exams.update((exams) => [...exams, exam]);
        this.resetExamForm();
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
    // Update form config with exam data
    this.examFormConfig.update(config => ({
      ...config,
      submitText: 'Update Exam',
      sections: config.sections.map(section => ({
        ...section,
        fields: section.fields.map(field => ({
          ...field,
          value: (exam as any)[field.name] || field.value
        }))
      }))
    }));
  }

  updateExam(examData: any) {
    const examId = this.editingExamId();
    if (!examId) return;

    this.examsService.update(examId, examData).subscribe({
      next: (exam) => {
        this.exams.update((exams) => exams.map((e) => (e.id === examId ? exam : e)));
        this.resetExamForm();
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

  resetExamForm() {
    this.editingExamId.set(null);
    this.examFormConfig.update(config => ({
      ...config,
      submitText: 'Add Exam',
      sections: config.sections.map(section => ({
        ...section,
        fields: section.fields.map(field => ({
          ...field,
          value: field.name === 'priority' ? 'medium' : ''
        }))
      }))
    }));
  }

  // Task methods
  handleTaskSubmit(event: FormSubmitEvent) {
    const data = event.data;
    
    const validation = this.validationService.validateTaskForm(
      data['title'], 
      data['dueDate'], 
      data['description']
    );
    
    if (!validation.valid) {
      this.notificationService.warning(validation.error || 'שגיאת ולידציה');
      return;
    }

    const taskData = {
      title: data['title'],
      dueDate: data['dueDate'],
      description: data['description'] || undefined,
      subject: data['subject'] || undefined,
      priority: data['priority'] as 'low' | 'medium' | 'high',
      completed: false,
    };

    if (this.editingTaskId()) {
      this.updateTask(taskData);
    } else {
      this.addTask(taskData);
    }
  }

  addTask(taskData: any) {
    this.tasksService.create(taskData).subscribe({
      next: (task) => {
        this.tasks.update((tasks) => [...tasks, task]);
        this.resetTaskForm();
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
    // Update form config with task data
    this.taskFormConfig.update(config => ({
      ...config,
      submitText: 'Update Task',
      sections: config.sections.map(section => ({
        ...section,
        fields: section.fields.map(field => ({
          ...field,
          value: (task as any)[field.name] || field.value
        }))
      }))
    }));
  }

  updateTask(taskData: any) {
    const taskId = this.editingTaskId();
    if (!taskId) return;

    this.tasksService.update(taskId, taskData).subscribe({
      next: (task) => {
        this.tasks.update((tasks) => tasks.map((t) => (t.id === taskId ? task : t)));
        this.resetTaskForm();
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
    this.taskFormConfig.update(config => ({
      ...config,
      submitText: 'Add Task',
      sections: config.sections.map(section => ({
        ...section,
        fields: section.fields.map(field => ({
          ...field,
          value: field.name === 'priority' ? 'medium' : ''
        }))
      }))
    }));
  }

  resetTaskForm() {
    this.clearTaskForm();
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
