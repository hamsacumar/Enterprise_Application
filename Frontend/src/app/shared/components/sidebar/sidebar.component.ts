import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/models/auth.models';

interface MenuItem {
  icon: string;
  label: string;
  route: string;
  active: boolean;
  badge: string | null;
  roles: string[]; // Allowed roles for this menu item
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
  isAuthenticated = false;
  private userSubscription?: Subscription;

  allMenuItems: MenuItem[] = [
    { icon: '🏠', label: 'Dashboard', route: '/dashboard', active: true, badge: null, roles: ['Admin', 'Worker', 'User'] },
    { icon: '📋', label: 'Admin Panel', route: '/admin', active: false, badge: null, roles: ['Admin'] },
    { icon: '👥', label: 'User Management', route: '/users', active: false, badge: null, roles: ['Admin'] },
    { icon: '📅', label: 'Appointments', route: '/appointments', active: false, badge: '8', roles: ['Admin', 'Worker', 'User'] },
    { icon: '🚗', label: 'My Vehicles', route: '/vehicles', active: false, badge: null, roles: ['User'] },
    { icon: '💧', label: 'Services', route: '/services', active: false, badge: null, roles: ['Admin', 'Worker', 'User'] },
    { icon: '⏱️', label: 'Service History', route: '/history', active: false, badge: null, roles: ['Admin', 'Worker', 'User'] },
    { icon: '💬', label: 'Messages', route: '/messages', active: false, badge: '3', roles: ['Admin', 'Worker', 'User'] },
    { icon: '💳', label: 'Payments', route: '/payments', active: false, badge: null, roles: ['Admin', 'Worker', 'User'] },
    { icon: '📊', label: 'Reports', route: '/reports', active: false, badge: null, roles: ['Admin', 'Worker'] },
    { icon: '⚙️', label: 'Settings', route: '/settings', active: false, badge: null, roles: ['Admin', 'Worker', 'User'] }
  ];

  menuItems: MenuItem[] = [];
  isCollapsed = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.userSubscription = this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.isAuthenticated = user !== null;
      this.filterMenuByRole();
    });
  }

  ngOnDestroy() {
    this.userSubscription?.unsubscribe();
  }

  filterMenuByRole() {
    if (!this.currentUser) {
      this.menuItems = [];
      return;
    }

    // Filter menu items based on user role
    this.menuItems = this.allMenuItems.filter(item => 
      item.roles.includes(this.currentUser!.role)
    );
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  setActive(index: number) {
    this.menuItems.forEach((item, i) => {
      item.active = i === index;
    });
    
    // Navigate to the route
    const selectedItem = this.menuItems[index];
    if (selectedItem.route) {
      this.router.navigate([selectedItem.route]);
    }
  }

  getUserAvatar(): string {
    if (!this.currentUser) return '👤';
    const names = this.currentUser.name.split(' ');
    if (names.length >= 2) {
      return names[0][0] + names[1][0];
    }
    return this.currentUser.name[0];
  }
}

