import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from '../models/content.models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  private apiUrl = `${environment.apiUrl}/tasks`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl);
  }

  create(task: Omit<Task, 'id'>): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, task);
  }

  update(id: string, task: Partial<Task>): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${id}`, task);
  }

  delete(id: string): Observable<{ success: boolean }> {
    return this.http.delete<{ success: boolean }>(`${this.apiUrl}/${id}`);
  }
}
