import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Meme } from '../../models/meme.models';
import { environment } from '../../../environments/environment';

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

  private readonly apiUrl = `${environment.apiUrl}/memes`;

  constructor(private http: HttpClient, public router: Router) {
    this.loadMemes();
  }

  loadMemes() {
    this.http.get<Meme[]>(this.apiUrl).subscribe({
      next: (memes) => this.memes.set(memes),
      error: (err) => console.error('Failed to load memes:', err),
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.selectedFile.set(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewUrl.set(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  uploadMeme() {
    const file = this.selectedFile();
    if (!file) return;

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
      },
      error: (err) => {
        console.error('Upload failed:', err);
        alert('העלאה נכשלה. נסה שוב.');
        this.uploading.set(false);
      },
    });
  }

  deleteMeme(id: string) {
    if (!confirm('בטוח שאתה רוצה למחוק את המם?')) return;

    this.http.delete<{ success: boolean }>(`${this.apiUrl}/${id}`).subscribe({
      next: () => {
        this.memes.update((memes) => memes.filter((m) => m.id !== id));
      },
      error: (err) => console.error('Delete failed:', err),
    });
  }

  clearForm() {
    this.selectedFile.set(null);
    this.caption = '';
    this.uploadedBy = '';
    this.previewUrl.set(null);
  }

  getMemeUrl(filename: string): string {{
    return `/uploads/memes/${filename}`;
  }
}
