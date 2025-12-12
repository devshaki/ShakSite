import { Injectable } from '@nestjs/common';
import { ExamDate } from './exam.interface';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ExamsService {
  private readonly dataPath = path.join(__dirname, '../../data/exams.json');

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

  private readData(): ExamDate[] {
    const data = fs.readFileSync(this.dataPath, 'utf8');
    return JSON.parse(data);
  }

  private writeData(exams: ExamDate[]) {
    fs.writeFileSync(this.dataPath, JSON.stringify(exams, null, 2));
  }

  findAll(): ExamDate[] {
    return this.readData();
  }

  create(exam: Omit<ExamDate, 'id'>): ExamDate {
    const exams = this.readData();
    const newExam: ExamDate = {
      ...exam,
      id: Date.now().toString(),
    };
    exams.push(newExam);
    this.writeData(exams);
    return newExam;
  }

  update(id: string, exam: Partial<ExamDate>): ExamDate | null {
    const exams = this.readData();
    const index = exams.findIndex(e => e.id === id);
    if (index === -1) return null;
    
    exams[index] = { ...exams[index], ...exam, id };
    this.writeData(exams);
    return exams[index];
  }

  delete(id: string): boolean {
    const exams = this.readData();
    const filtered = exams.filter(e => e.id !== id);
    if (filtered.length === exams.length) return false;
    
    this.writeData(filtered);
    return true;
  }
}
