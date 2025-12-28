import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class Navbar {
  constructor(
    public router: Router,
    public themeService: ThemeService
  ) {}

  setTheme(theme: string): void {
    this.themeService.setTheme(theme as any);
  }

  isActive(route: string): boolean {
    return this.router.url === route;
  }
}
