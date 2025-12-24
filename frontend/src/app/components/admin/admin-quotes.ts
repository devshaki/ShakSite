import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Quote } from '../../models/content.models';
import { QuotesService } from '../../services/quotes.service';
import { NotificationService } from '../../services/notification.service';
import { ValidationService } from '../../services/validation.service';

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
  searchTerm = signal('');

  constructor(
    private quotesService: QuotesService,
    public router: Router,
    private notificationService: NotificationService,
    private validationService: ValidationService
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
    const author = this.newQuoteAuthor().trim();

    const validation = this.validationService.validateQuoteForm(text, author);
    if (!validation.valid) {
      this.notificationService.warning(validation.error || 'שגיאת ולידציה');
      return;
    }

    const newQuote = {
      text,
      author: author || undefined,
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

  getFilteredQuotes(): Quote[] {
    const term = this.searchTerm().toLowerCase();
    if (!term) return this.quotes();

    return this.quotes().filter(quote =>
      quote.text.toLowerCase().includes(term) ||
      quote.author?.toLowerCase().includes(term)
    );
  }
}
