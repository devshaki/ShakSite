import { Injectable, signal } from '@angular/core';
import { Notification, NotificationType } from '../models/notification.models';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly DEFAULT_DURATION = 3000;

  notifications = signal<Notification[]>([]);

  show(message: string, type: NotificationType = 'info', duration?: number): void {
    const notification: Notification = {
      id: this.generateId(),
      type,
      message,
      duration: duration ?? this.DEFAULT_DURATION,
      timestamp: new Date()
    };

    this.notifications.update(notifications => [...notifications, notification]);

    if (notification.duration > 0) {
      setTimeout(() => this.dismiss(notification.id), notification.duration);
    }
  }

  success(message: string, duration?: number): void {
    this.show(message, 'success', duration);
  }

  error(message: string, duration?: number): void {
    this.show(message, 'error', duration);
  }

  warning(message: string, duration?: number): void {
    this.show(message, 'warning', duration);
  }

  info(message: string, duration?: number): void {
    this.show(message, 'info', duration);
  }

  dismiss(id: string): void {
    this.notifications.update(notifications =>
      notifications.filter(n => n.id !== id)
    );
  }

  clear(): void {
    this.notifications.set([]);
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
