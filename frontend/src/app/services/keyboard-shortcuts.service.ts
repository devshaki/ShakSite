import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ThemeService } from './theme.service';

export interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  description: string;
  action: () => void;
}

@Injectable({
  providedIn: 'root'
})
export class KeyboardShortcutsService {
  private shortcuts: KeyboardShortcut[] = [];
  private enabled = true;

  constructor(
    private router: Router,
    private themeService: ThemeService
  ) {
    this.registerDefaultShortcuts();
  }

  private registerDefaultShortcuts(): void {
    this.shortcuts = [
      {
        key: 'h',
        ctrlKey: true,
        description: 'מעבר לדף הבית',
        action: () => this.router.navigate(['/'])
      },
      {
        key: 'a',
        ctrlKey: true,
        description: 'מעבר לעמוד הניהול',
        action: () => this.router.navigate(['/admin'])
      },
      {
        key: 't',
        ctrlKey: true,
        description: 'החלפת ערכת צבעים',
        action: () => this.themeService.cycleTheme()
      },
      {
        key: 'g',
        ctrlKey: true,
        description: 'החלפת קבוצה (A/B)',
        action: () => this.themeService.toggleGroup()
      },
      {
        key: 'q',
        ctrlKey: true,
        description: 'מעבר לציטוטים',
        action: () => this.router.navigate(['/quotes'])
      },
      {
        key: 'm',
        ctrlKey: true,
        description: 'מעבר לגלריית ממים',
        action: () => this.router.navigate(['/memes'])
      },
      {
        key: '?',
        shiftKey: true,
        description: 'הצג רשימת קיצורי מקשים',
        action: () => this.showShortcutsHelp()
      }
    ];
  }

  handleKeyboardEvent(event: KeyboardEvent): void {
    if (!this.enabled) return;

    const target = event.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') {
      return;
    }

    for (const shortcut of this.shortcuts) {
      if (
        event.key.toLowerCase() === shortcut.key.toLowerCase() &&
        !!event.ctrlKey === !!shortcut.ctrlKey &&
        !!event.shiftKey === !!shortcut.shiftKey &&
        !!event.altKey === !!shortcut.altKey
      ) {
        event.preventDefault();
        shortcut.action();
        break;
      }
    }
  }

  private showShortcutsHelp(): void {
    const shortcuts = this.shortcuts
      .map(s => {
        const keys = [];
        if (s.ctrlKey) keys.push('Ctrl');
        if (s.shiftKey) keys.push('Shift');
        if (s.altKey) keys.push('Alt');
        keys.push(s.key.toUpperCase());
        return `${keys.join('+')} - ${s.description}`;
      })
      .join('\n');

    alert(`קיצורי מקשים זמינים:\n\n${shortcuts}`);
  }

  registerShortcut(shortcut: KeyboardShortcut): void {
    this.shortcuts.push(shortcut);
  }

  unregisterShortcut(key: string): void {
    this.shortcuts = this.shortcuts.filter(s => s.key !== key);
  }

  enable(): void {
    this.enabled = true;
  }

  disable(): void {
    this.enabled = false;
  }

  getShortcuts(): KeyboardShortcut[] {
    return [...this.shortcuts];
  }
}
