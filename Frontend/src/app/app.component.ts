import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, NavbarComponent, SidebarComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Enterprise Application';
  isAuthenticated = false;
  private authSubscription?: Subscription;

  constructor(
    public router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Subscribe to authentication status changes
    this.authSubscription = this.authService.currentUser$.subscribe(user => {
      this.isAuthenticated = user !== null;
    });
  }

  ngOnDestroy(): void {
    this.authSubscription?.unsubscribe();
  }

  isLandingPage(): boolean {
    return this.router.url === '' || this.router.url === '/';
  }

  isAuthenticatedArea(): boolean {
    return (
      this.router.url.startsWith('/admin') ||
      this.router.url.startsWith('/user') ||
      this.router.url.startsWith('/worker-dashboard') ||
      this.router.url.startsWith('/chat') ||
      this.router.url.startsWith('/ai')
    );
  }

  shouldShowSidebar(): boolean {
    // Show sidebar when user is authenticated AND in authenticated area, OR in demo mode
    return (this.isAuthenticated && this.isAuthenticatedArea()) || this.isInDemoMode();
  }

  isInDemoMode(): boolean {
    return localStorage.getItem('demoMode') === 'true' && !!localStorage.getItem('userRole');
  }
}
