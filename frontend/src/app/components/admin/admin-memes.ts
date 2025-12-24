import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Meme } from '../../models/meme.models';
import { environment } from '../../../environments/environment';
import { NotificationService } from '../../services/notification.service';
import { ValidationService } from '../../services/validation.service';

@Component({
  selector: 'app-admin-memes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-memes.html',
  styleUrl: './admin-memes.scss',
})
export class AdminMemes {
  memes = signal<Meme[]>([]);
  selectedFile = signal<File | null>(null);
  caption = '';
  uploadedBy = '';
  uploading = signal(false);
  previewUrl = signal<string | null>(null);
  searchTerm = signal('');

  private readonly apiUrl = `${environment.apiUrl}/memes`;

  constructor(
    private http: HttpClient,
    public router: Router,
    private notificationService: NotificationService,
    private validationService: ValidationService
  ) {
    this.loadMemes();
  }

  loadMemes() {
    this.http.get<Meme[]>(this.apiUrl).subscribe({
      next: (memes) => this.memes.set(memes),
      error: (err) => {
        console.error('Failed to load memes:', err);
        this.notificationService.error('טעינת ממים נכשלה');
      },
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.selectedFile.set(file);

      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewUrl.set(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  uploadMeme() {
    const file = this.selectedFile();
    if (!file) {
      this.notificationService.warning('נא לבחור קובץ להעלאה');
      return;
    }

    const validation = this.validationService.validateMemeUpload(
      file,
      this.caption,
      this.uploadedBy
    );
    if (!validation.valid) {
      this.notificationService.warning(validation.error || 'שגיאת ולידציה');
      return;
    }

    this.uploading.set(true);
    const formData = new FormData();
    formData.append('file', file);
    if (this.caption) formData.append('caption', this.caption);
    if (this.uploadedBy) formData.append('uploadedBy', this.uploadedBy);

    this.http.post<Meme>(`${this.apiUrl}/upload`, formData).subscribe({
      next: (meme) => {
        this.memes.update((memes) => [meme, ...memes]);
        this.clearForm();
        this.uploading.set(false);
        this.notificationService.success('מם הועלה בהצלחה');
      },
      error: (err) => {
        console.error('Upload failed:', err);
        this.notificationService.error('העלאת מם נכשלה');
        this.uploading.set(false);
      },
    });
  }

  deleteMeme(id: string) {
    if (!confirm('בטוח שאתה רוצה למחוק את המם?')) return;

    this.http.delete<{ success: boolean }>(`${this.apiUrl}/${id}`).subscribe({
      next: () => {
        this.memes.update((memes) => memes.filter((m) => m.id !== id));
        this.notificationService.success('מם נמחק בהצלחה');
      },
      error: (err) => {
        console.error('Delete failed:', err);
        this.notificationService.error('מחיקת מם נכשלה');
      },
    });
  }

  clearForm() {
    this.selectedFile.set(null);
    this.caption = '';
    this.uploadedBy = '';
    this.previewUrl.set(null);
  }

  getMemeUrl(filename: string): string {
    const url = `${this.apiUrl}/image/${filename}`;
    console.log('Loading meme image:', url);
    return url;
  }

  getFilteredMemes(): Meme[] {
    const term = this.searchTerm().toLowerCase();
    if (!term) return this.memes();

    return this.memes().filter(meme =>
      meme.caption?.toLowerCase().includes(term) ||
      meme.uploadedBy?.toLowerCase().includes(term) ||
      meme.originalName?.toLowerCase().includes(term)
    );
  }

  onImageError(event: Event, meme: any) {
    console.error('Failed to load image:', meme.filename, 'URL:', this.getMemeUrl(meme.filename));
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
    // Show error message
    const parent = img.parentElement;
    if (parent) {
      const errorDiv = document.createElement('div');
      errorDiv.className = 'image-error';
      errorDiv.textContent = `שגיאה בטעינת תמונה: ${meme.filename}`;
      parent.appendChild(errorDiv);
    }
  }
}
