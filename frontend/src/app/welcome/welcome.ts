import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  imports: [CommonModule, RouterLink],
  selector: 'app-welcome',
  styleUrl: './welcome.scss',
  templateUrl: './welcome.html',
})
export class Welcome {
  constructor(
    public auth: AuthService,
    private router: Router,
  ) {}

  get isAdmin(): boolean {
    return this.auth.currentUser()?.role === 'admin';
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
