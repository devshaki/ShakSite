import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Timer } from '../timer/timer';
import { ScheduleGrid } from '../schedule-grid/schedule-grid';
import { ScheduleService } from '../../services/schedule.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-schedule-view',
  standalone: true,
  imports: [Timer, ScheduleGrid],
  templateUrl: './schedule-view.html',
  styleUrl: './schedule-view.scss'
})
export class ScheduleView {
  dailyQuote = signal('');

  constructor(
    private scheduleService: ScheduleService,
    public themeService: ThemeService,
    public router: Router
  ) {
    this.dailyQuote.set(this.scheduleService.getDailyQuote());
  }
}
