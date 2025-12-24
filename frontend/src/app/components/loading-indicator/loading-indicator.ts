import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'app-loading-indicator',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loading-indicator.html',
  styleUrl: './loading-indicator.scss'
})
export class LoadingIndicator {
  constructor(public loadingService: LoadingService) {}
}
