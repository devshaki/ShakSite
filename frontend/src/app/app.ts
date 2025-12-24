import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Toast } from './components/toast/toast';
import { LoadingIndicator } from './components/loading-indicator/loading-indicator';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Toast, LoadingIndicator],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
}
