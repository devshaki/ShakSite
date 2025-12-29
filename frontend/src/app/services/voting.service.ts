import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Meme } from '../models/meme.models';

@Injectable({
  providedIn: 'root'
})
export class VotingService {
  private readonly STORAGE_KEY = 'meme-votes';
  private readonly apiUrl = `${environment.apiUrl}/memes`;

  private votes = signal<Map<string, 'up' | 'down'>>(this.loadVotes());

  constructor(private http: HttpClient) {}

  private loadVotes(): Map<string, 'up' | 'down'> {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return new Map(Object.entries(parsed));
    }
    return new Map();
  }

  private saveVotes(): void {
    const obj = Object.fromEntries(this.votes());
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(obj));
  }

  vote(memeId: string, voteType: 'up' | 'down'): Observable<Meme> {
    const currentVote = this.votes().get(memeId);

    if (currentVote === voteType) {
      return new Observable(observer => {
        observer.next({} as Meme);
        observer.complete();
      });
    }

    this.votes().set(memeId, voteType);
    this.saveVotes();

    return this.http.post<Meme>(`${this.apiUrl}/${memeId}/vote`, { voteType });
  }

  getUserVote(memeId: string): 'up' | 'down' | null {
    return this.votes().get(memeId) || null;
  }

  hasVoted(memeId: string): boolean {
    return this.votes().has(memeId);
  }

  getHallOfFame(): Observable<Meme[]> {
    return this.http.get<Meme[]>(`${this.apiUrl}/hall-of-fame`);
  }
}
