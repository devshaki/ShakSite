import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { ScheduleService } from '../../services/schedule.service';
import { CurrentPeriod } from '../../models/schedule.models';

const PERIOD_REFRESH_INTERVAL_MS = 10_000;

@Component({
  selector: 'app-timer',
  imports: [],
  templateUrl: './timer.html',
  styleUrl: './timer.scss',
})
export class Timer implements OnInit, OnDestroy {
  currentPeriod = signal<CurrentPeriod | null>(null);
  private intervalId?: number;

  constructor(private scheduleService: ScheduleService) {}

  ngOnInit(): void {
    this.updateCurrentPeriod();
    this.intervalId = window.setInterval(() => {
      this.updateCurrentPeriod();
    }, PERIOD_REFRESH_INTERVAL_MS);
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  private updateCurrentPeriod(): void {
    this.currentPeriod.set(this.scheduleService.getCurrentPeriod());
  }

  formatTime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}:${String(mins).padStart(2, '0')}`;
    }
    return `${mins} דקות`;
  }
}
