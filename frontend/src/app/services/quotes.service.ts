import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Quote } from '../models/content.models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class QuotesService {
  private apiUrl = `${environment.apiUrl}/quotes`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Quote[]> {
    return this.http.get<Quote[]>(this.apiUrl);
  }

  create(quote: Omit<Quote, 'id'>): Observable<Quote> {
    return this.http.post<Quote>(this.apiUrl, quote);
  }

  delete(id: string): Observable<{ success: boolean }> {
    return this.http.delete<{ success: boolean }>(`${this.apiUrl}/${id}`);
  }
}
