import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Meme } from '../../models/meme.models';
import { environment } from '../../../environments/environment';
import { NotificationService } from '../../services/notification.service';
import { ValidationService } from '../../services/validation.service';
import { FavoritesService } from '../../services/favorites.service';
import { VotingService } from '../../services/voting.service';

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
  showOnlyFavorites = signal(false);
  showHallOfFame = signal(false);
  hallOfFameMemes = signal<Meme[]>([]);

  showModal = signal(false);
  selectedMeme = signal<Meme | null>(null);

  private readonly apiUrl = `${environment.apiUrl}/memes`;

  constructor(
    private http: HttpClient,
    public router: Router,
    private notificationService: NotificationService,
    private validationService: ValidationService,
    public favoritesService: FavoritesService,
    public votingService: VotingService
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

  toggleFavorite(memeId: string): void {
    const isFavorited = this.favoritesService.toggleFavorite(memeId);
    const message = isFavorited ? 'נוסף למועדפים' : 'הוסר מהמועדפים';
    this.notificationService.success(message);
  }

  getFilteredMemes(): Meme[] {
    let filtered = this.memes().map(meme => ({
      ...meme,
      favorited: this.favoritesService.isFavorite(meme.id)
    }));

    if (this.showOnlyFavorites()) {
      filtered = filtered.filter(meme => meme.favorited);
    }

    const term = this.searchTerm().toLowerCase();
    if (term) {
      filtered = filtered.filter(meme =>
        meme.caption?.toLowerCase().includes(term) ||
        meme.uploadedBy?.toLowerCase().includes(term) ||
        meme.originalName?.toLowerCase().includes(term)
      );
    }

    return filtered;
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
  
  openModal(meme: Meme): void {
    this.selectedMeme.set(meme);
    this.showModal.set(true);
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
  }
  
  closeModal(): void {
    this.showModal.set(false);
    this.selectedMeme.set(null);
    document.body.style.overflow = '';
  }

  vote(memeId: string, voteType: 'up' | 'down'): void {
    const currentVote = this.votingService.getUserVote(memeId);

    if (currentVote === voteType) {
      this.notificationService.warning('כבר הצבעת על מם זה');
      return;
    }

    this.votingService.vote(memeId, voteType).subscribe({
      next: (updatedMeme) => {
        this.memes.update(memes =>
          memes.map(m => m.id === memeId ? updatedMeme : m)
        );
        this.notificationService.success(
          voteType === 'up' ? 'הצבעה חיובית נרשמה' : 'הצבעה שלילית נרשמה'
        );

        if (this.showHallOfFame()) {
          this.loadHallOfFame();
        }
      },
      error: (err) => {
        console.error('Vote failed:', err);
        this.notificationService.error('ההצבעה נכשלה');
      }
    });
  }

  toggleHallOfFame(): void {
    this.showHallOfFame.update(show => !show);
    if (this.showHallOfFame()) {
      this.loadHallOfFame();
    }
  }

  loadHallOfFame(): void {
    this.votingService.getHallOfFame().subscribe({
      next: (memes) => this.hallOfFameMemes.set(memes),
      error: (err) => {
        console.error('Failed to load hall of fame:', err);
        this.notificationService.error('טעינת היכל התהילה נכשלה');
      }
    });
  }
}
