import { Component, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Timer } from '../timer/timer';
import { ScheduleGrid } from '../schedule-grid/schedule-grid';
import { ScheduleService } from '../../services/schedule.service';
import { ThemeService } from '../../services/theme.service';
import { QuotesService } from '../../services/quotes.service';

@Component({
  selector: 'app-schedule-view',
  standalone: true,
  imports: [Timer, ScheduleGrid],
  templateUrl: './schedule-view.html',
  styleUrl: './schedule-view.scss'
})
export class ScheduleView implements OnInit {
  dailyQuote = signal('');

  constructor(
    private scheduleService: ScheduleService,
    public themeService: ThemeService,
    public router: Router,
    private quotesService: QuotesService
  ) {}

  ngOnInit() {
    this.loadDailyQuote();
  }

  private loadDailyQuote() {
    // Load quotes from backend
    this.quotesService.getAll().subscribe({
      next: (quotes) => {
        const allQuotes = quotes.map(q => q.author ? `${q.text} — ${q.author}` : q.text);
        
        if (allQuotes.length > 0) {
          // Pick quote based on day of year
          const today = new Date();
          const dayOfYear = Math.floor(
            (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
          );
          this.dailyQuote.set(allQuotes[dayOfYear % allQuotes.length]);
        } else {
          // Fallback to default quote if no custom quotes
          this.dailyQuote.set(this.scheduleService.getDailyQuote());
        }
      },
      error: (err) => {
        console.error('Failed to load quotes:', err);
        // Fallback to default quote
        this.dailyQuote.set(this.scheduleService.getDailyQuote());
      }
    });
  }
}
