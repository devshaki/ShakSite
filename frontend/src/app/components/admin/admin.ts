import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AdminContent } from './admin-content';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, AdminContent],
  templateUrl: './admin.html',
  styleUrl: './admin.scss'
})
export class Admin {
  constructor(public router: Router) {}
}
