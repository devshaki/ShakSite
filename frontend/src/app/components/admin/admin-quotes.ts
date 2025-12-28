import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Quote } from '../../models/content.models';
import { QuotesService } from '../../services/quotes.service';
import { NotificationService } from '../../services/notification.service';
import { ValidationService } from '../../services/validation.service';
import { FormBuilder } from '../form-builder/form-builder';
import { FormConfig, FormSubmitEvent } from '../../models/form-builder.models';

@Component({
  selector: 'app-admin-quotes',
  standalone: true,
  imports: [CommonModule, FormsModule, FormBuilder],
  templateUrl: './admin-quotes.html',
  styleUrl: './admin-quotes.scss',
})
export class AdminQuotes {
  quotes = signal<Quote[]>([]);
  searchTerm = signal('');

  // Form configuration
  quoteFormConfig = signal<FormConfig>({
    title: 'Quotes Management',
    titleIcon: '💬',
    colorTheme: 'green',
    submitText: 'Add Quote',
    sections: [
      {
        label: 'Quote Details',
        icon: '✍️',
        fields: [
          {
            name: 'text',
            label: 'Quote Text',
            type: 'textarea',
            placeholder: 'Enter the quote text...',
            required: true,
            icon: '💬',
            rows: 5,
            hint: 'The main text of the quote'
          },
          {
            name: 'author',
            label: 'Author',
            type: 'text',
            placeholder: 'Who said this?',
            icon: '✒️',
            hint: 'Optional - leave empty for anonymous'
          }
        ]
      }
    ]
  });

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

  handleQuoteSubmit(event: FormSubmitEvent) {
    const data = event.data;
    
    const validation = this.validationService.validateQuoteForm(data['text'], data['author']);
    if (!validation.valid) {
      this.notificationService.warning(validation.error || 'שגיאת ולידציה');
      return;
    }

    const newQuote = {
      text: data['text'],
      author: data['author'] || undefined,
      addedDate: new Date().toISOString(),
    };

    this.quotesService.create(newQuote).subscribe({
      next: (quote) => {
        this.quotes.update((quotes) => [...quotes, quote]);
        this.resetQuoteForm();
        this.notificationService.success('ציטוט נוסף בהצלחה');
      },
      error: (err) => {
        console.error('Failed to add quote:', err);
        this.notificationService.error('הוספת ציטוט נכשלה');
      },
    });
  }

  resetQuoteForm() {
    this.quoteFormConfig.update(config => ({
      ...config,
      sections: config.sections.map(section => ({
        ...section,
        fields: section.fields.map(field => ({
          ...field,
          value: ''
        }))
      }))
    }));
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
