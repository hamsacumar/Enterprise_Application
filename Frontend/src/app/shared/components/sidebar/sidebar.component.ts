import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/models/auth.models';

interface NavItem {
  id: string;
  label: string;
  route: string;
  icon: string;
  order: number;
  subItems?: NavItem[];
  requiredRole?: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit, OnDestroy {
  navItems: NavItem[] = [];
  userRole: string = 'Customer';
  currentUser: User | null = null;
  isOpen = true;
  expandedItems: Set<string> = new Set();
  private userSubscription?: Subscription;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // Subscribe to current user changes
    this.userSubscription = this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      const role = user?.role || 'Customer';
      // Normalize legacy 'User' to 'Customer'
      this.userRole = role === 'User' ? 'Customer' : role;
      this.loadNavigation();
    });
  }

  ngOnDestroy(): void {
    this.userSubscription?.unsubscribe();
  }

  loadNavigation(): void {
    // Use default navigation for now
    // Later, connect to backend API if available
    this.navItems = this.getDefaultNavigation();
  }

  // Default navigation if backend call fails
  private getDefaultNavigation(): NavItem[] {
    // Get the user role to determine which menu to show
    const role = this.userRole;

    if (role === 'Admin') {
      return this.getAdminNavigation();
    } else if (role === 'Worker') {
      return this.getWorkerNavigation();
    } else {
      return this.getCustomerNavigation();
    }
  }

  private getAdminNavigation(): NavItem[] {
    return [
      {
        id: 'admin-dashboard',
        label: 'Dashboard',
        route: '/app/admin/dashboard',
        icon: '📊',
        order: 1,
        requiredRole: 'Admin'
      },
      {
        id: 'admin-services',
        label: 'Services',
        route: '/app/admin/services',
        icon: '🔧',
        order: 2,
        requiredRole: 'Admin'
      },
      {
        id: 'admin-workers',
        label: 'Workers',
        route: '/app/admin/workers',
        icon: '👷',
        order: 3,
        requiredRole: 'Admin'
      },
      {
        id: 'admin-orders',
        label: 'Orders',
        route: '/app/admin/orders',
        icon: '📋',
        order: 4,
        requiredRole: 'Admin'
      },
      {
        id: 'admin-customers',
        label: 'Customers',
        route: '/app/admin/customers',
        icon: '👥',
        order: 5,
        requiredRole: 'Admin'
      },
      {
        id: 'admin-settings',
        label: 'Settings',
        route: '/app/admin/settings',
        icon: '⚙️',
        order: 6,
        requiredRole: 'Admin'
      }
    ];
  }

  private getWorkerNavigation(): NavItem[] {
    return [
      {
        id: 'worker-new',
        label: 'New',
        route: '/app/worker/new',
        icon: '🆕',
        order: 1,
        requiredRole: 'Worker'
      },
      {
        id: 'worker-pending',
        label: 'Pending',
        route: '/app/worker/pending',
        icon: '⏳',
        order: 2,
        requiredRole: 'Worker'
      },
      {
        id: 'worker-on-work',
        label: 'On Work',
        route: '/app/worker/on-work',
        icon: '🔧',
        order: 3,
        requiredRole: 'Worker'
      },
      {
        id: 'worker-complete',
        label: 'Complete',
        route: '/app/worker/complete',
        icon: '✅',
        order: 4,
        requiredRole: 'Worker'
      }
    ];
  }

  private getCustomerNavigation(): NavItem[] {
    return [
      {
        id: 'customer-dashboard',
        label: 'Dashboard',
        route: '/app/user/dashboard',
        icon: '📊',
        order: 1,
        requiredRole: 'Customer'
      },
      {
        id: 'customer-book-service',
        label: 'Book Service',
        route: '/app/user/book-service',
        icon: '🔧',
        order: 2,
        requiredRole: 'Customer'
      },
      {
        id: 'customer-notifications',
        label: 'Notifications',
        route: '/app/user/notifications',
        icon: '🔔',
        order: 3,
        requiredRole: 'Customer'
      },
      {
        id: 'customer-my-bookings',
        label: 'My Bookings',
        route: '/app/user/my-bookings',
        icon: '📅',
        order: 4,
        requiredRole: 'Customer'
      },
      {
        id: 'customer-my-vehicles',
        label: 'My Vehicles',
        route: '/app/user/my-vehicles',
        icon: '🚗',
        order: 5,
        requiredRole: 'Customer'
      },
      {
        id: 'customer-past-orders',
        label: 'Past Orders',
        route: '/app/user/past-orders',
        icon: '📚',
        order: 6,
        requiredRole: 'Customer'
      },
      {
        id: 'customer-request-modification',
        label: 'Request Modification',
        route: '/app/user/request-modification',
        icon: '✏️',
        order: 7,
        requiredRole: 'Customer'
      },
      {
        id: 'customer-payment-details',
        label: 'Payment Details',
        route: '/app/user/payment-details',
        icon: '💳',
        order: 8,
        requiredRole: 'Customer'
      }
    ];
  }

  // Check if item should be visible based on role
  canViewItem(item: NavItem): boolean {
    if (!item.requiredRole) return true;
    // Compare case-insensitively and normalize 'User' to 'Customer'
    const req = item.requiredRole.toLowerCase() === 'user' ? 'customer' : item.requiredRole.toLowerCase();
    const cur = this.userRole.toLowerCase() === 'user' ? 'customer' : this.userRole.toLowerCase();
    return req === cur;
  }

  // Toggle submenu expansion
  toggleSubMenu(itemId: string): void {
    if (this.expandedItems.has(itemId)) {
      this.expandedItems.delete(itemId);
    } else {
      this.expandedItems.add(itemId);
    }
  }

  // Check if submenu is expanded
  isExpanded(itemId: string): boolean {
    return this.expandedItems.has(itemId);
  }

  // Toggle sidebar open/close
  toggleSidebar(): void {
    this.isOpen = !this.isOpen;
  }

  // Get user initials for avatar
  getUserInitials(): string {
    if (!this.currentUser) return '?';
    const display = this.currentUser.name || this.currentUser.email || '';
    if (!display || display.length === 0) return '?';

    const names = display.split(' ').filter(Boolean);
    if (names.length >= 2) {
      return (names[0][0] || '?') + (names[1][0] || '?');
    }
    return display[0] || '?';
  }

  // Check if in demo mode
  // (Demo mode removed) — demo-related methods and UI have been removed.

  // Logout function
  logout(): void {
    this.authService.logout();
    window.location.href = '/login';
  }
}