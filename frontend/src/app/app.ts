import { Component, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Toast } from './components/toast/toast';
import { LoadingIndicator } from './components/loading-indicator/loading-indicator';
import { KeyboardShortcutsService } from './services/keyboard-shortcuts.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Toast, LoadingIndicator],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  constructor(private keyboardShortcutsService: KeyboardShortcutsService) {}

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {
    this.keyboardShortcutsService.handleKeyboardEvent(event);
  }
}
