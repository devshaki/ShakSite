import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ExamDate } from '../models/content.models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ExamsService {
  private apiUrl = `${environment.apiUrl}/exams`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<ExamDate[]> {
    return this.http.get<ExamDate[]>(this.apiUrl);
  }

  create(exam: Omit<ExamDate, 'id'>): Observable<ExamDate> {
    return this.http.post<ExamDate>(this.apiUrl, exam);
  }

  update(id: string, exam: Partial<ExamDate>): Observable<ExamDate> {
    return this.http.put<ExamDate>(`${this.apiUrl}/${id}`, exam);
  }

  delete(id: string): Observable<{ success: boolean }> {
    return this.http.delete<{ success: boolean }>(`${this.apiUrl}/${id}`);
  }
}
