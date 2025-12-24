import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private readonly FAVORITES_KEY = 'meme-favorites';
  private favoritesSet = signal<Set<string>>(new Set());

  constructor() {
    this.loadFavorites();
  }

  private loadFavorites(): void {
    const stored = localStorage.getItem(this.FAVORITES_KEY);
    if (stored) {
      try {
        const favorites = JSON.parse(stored) as string[];
        this.favoritesSet.set(new Set(favorites));
      } catch (error) {
        console.error('Failed to load favorites:', error);
      }
    }
  }

  private saveFavorites(): void {
    const favorites = Array.from(this.favoritesSet());
    localStorage.setItem(this.FAVORITES_KEY, JSON.stringify(favorites));
  }

  toggleFavorite(memeId: string): boolean {
    const favorites = new Set(this.favoritesSet());

    if (favorites.has(memeId)) {
      favorites.delete(memeId);
    } else {
      favorites.add(memeId);
    }

    this.favoritesSet.set(favorites);
    this.saveFavorites();

    return favorites.has(memeId);
  }

  isFavorite(memeId: string): boolean {
    return this.favoritesSet().has(memeId);
  }

  getFavorites(): string[] {
    return Array.from(this.favoritesSet());
  }

  clearFavorites(): void {
    this.favoritesSet.set(new Set());
    this.saveFavorites();
  }

  getFavoritesCount(): number {
    return this.favoritesSet().size;
  }
}
