import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AdminQuotes } from './admin-quotes';
import { AdminContent } from './admin-content';
import { AdminMemes } from './admin-memes';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, AdminQuotes, AdminContent, AdminMemes],
  templateUrl: './admin.html',
  styleUrl: './admin.scss'
})
export class Admin {
  activeTab = signal<'quotes' | 'content' | 'memes'>('content');

  constructor(public router: Router) {}

  setTab(tab: 'quotes' | 'content' | 'memes') {
    this.activeTab.set(tab);
  }
}
