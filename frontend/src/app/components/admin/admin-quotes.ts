import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Quote } from '../../models/content.models';
import { QuotesService } from '../../services/quotes.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-admin-quotes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-quotes.html',
  styleUrl: './admin-quotes.scss',
})
export class AdminQuotes {
  quotes = signal<Quote[]>([]);
  newQuoteText = signal('');
  newQuoteAuthor = signal('');

  constructor(
    private quotesService: QuotesService,
    public router: Router,
    private notificationService: NotificationService
  ) {
    this.loadQuotes();
  }

  loadQuotes() {
    this.quotesService.getAll().subscribe({
      next: (quotes) => this.quotes.set(quotes),
      error: (err) => {
        console.error('Failed to load quotes:', err);
        this.notificationService.error('טעינת ציטוטים נכשלה');
      },
    });
  }

  addQuote() {
    const text = this.newQuoteText().trim();
    if (!text) {
      this.notificationService.warning('נא למלא את טקסט הציטוט');
      return;
    }

    const newQuote = {
      text,
      author: this.newQuoteAuthor().trim() || undefined,
      addedDate: new Date().toISOString(),
    };

    this.quotesService.create(newQuote).subscribe({
      next: (quote) => {
        this.quotes.update((quotes) => [...quotes, quote]);
        this.newQuoteText.set('');
        this.newQuoteAuthor.set('');
        this.notificationService.success('ציטוט נוסף בהצלחה');
      },
      error: (err) => {
        console.error('Failed to add quote:', err);
        this.notificationService.error('הוספת ציטוט נכשלה');
      },
    });
  }

  deleteQuote(id: string) {
    this.quotesService.delete(id).subscribe({
      next: () => {
        this.quotes.update((quotes) => quotes.filter((q) => q.id !== id));
        this.notificationService.success('ציטוט נמחק בהצלחה');
      },
      error: (err) => {
        console.error('Failed to delete quote:', err);
        this.notificationService.error('מחיקת ציטוט נכשלה');
      },
    });
  }
}
