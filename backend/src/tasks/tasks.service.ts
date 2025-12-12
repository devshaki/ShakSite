import { Injectable } from '@nestjs/common';
import { Task } from './task.interface';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class TasksService {
  private readonly dataPath = path.join(__dirname, '../../data/tasks.json');

  constructor() {
    this.ensureDataFile();
  }

  private ensureDataFile() {
    const dir = path.dirname(this.dataPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(this.dataPath)) {
      fs.writeFileSync(this.dataPath, JSON.stringify([]));
    }
  }

  private readData(): Task[] {
    const data = fs.readFileSync(this.dataPath, 'utf8');
    return JSON.parse(data);
  }

  private writeData(tasks: Task[]) {
    fs.writeFileSync(this.dataPath, JSON.stringify(tasks, null, 2));
  }

  findAll(): Task[] {
    return this.readData();
  }

  create(task: Omit<Task, 'id'>): Task {
    const tasks = this.readData();
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
    };
    tasks.push(newTask);
    this.writeData(tasks);
    return newTask;
  }

  update(id: string, task: Partial<Task>): Task | null {
    const tasks = this.readData();
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) return null;
    
    tasks[index] = { ...tasks[index], ...task, id };
    this.writeData(tasks);
    return tasks[index];
  }

  delete(id: string): boolean {
    const tasks = this.readData();
    const filtered = tasks.filter(t => t.id !== id);
    if (filtered.length === tasks.length) return false;
    
    this.writeData(filtered);
    return true;
  }
}
