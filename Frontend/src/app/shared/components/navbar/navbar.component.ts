import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/models/auth.models';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  isMenuOpen = false;
  currentUser: User | null = null;
  isAuthenticated = false;
  private userSubscription?: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // Subscribe to current user changes
    this.userSubscription = this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.isAuthenticated = user !== null;
    });
  }

  ngOnDestroy() {
    this.userSubscription?.unsubscribe();
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
    this.isMenuOpen = false;
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
    this.isMenuOpen = false;
  }

  getUserInitials(): string {
    if (!this.currentUser) return '?';
    const names = this.currentUser.name.split(' ');
    if (names.length >= 2) {
      return names[0][0] + names[1][0];
    }
    return this.currentUser.name[0];
  }
}

