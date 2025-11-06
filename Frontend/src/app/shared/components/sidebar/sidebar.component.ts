import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

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
export class SidebarComponent implements OnInit {
  navItems: NavItem[] = [];
  userRole: string | null = 'User';
  isOpen = true;
  expandedItems: Set<string> = new Set();

  constructor() {}

  ngOnInit(): void {
    // Get user role from localStorage
    this.userRole = localStorage.getItem('userRole') || 'User';
    this.loadNavigation();
  }

  loadNavigation(): void {
    // Use default navigation for now
    // Later, connect to backend API if available
    this.navItems = this.getDefaultNavigation();
  }

  // Default navigation if backend call fails
  private getDefaultNavigation(): NavItem[] {
    // Get the user role to determine which menu to show
    const role = localStorage.getItem('userRole') || 'User';
    
    if (role === 'Admin') {
      // Admin-only navigation: Dashboard, Services, Workers, Orders, Customers, Settings
      return [
        {
          id: '1',
          label: 'Dashboard',
          route: '/admin-dashboard',
          icon: '📊',
          order: 1,
          requiredRole: 'Admin'
        },
        {
          id: '2',
          label: 'Services',
          route: '/services',
          icon: '🔧',
          order: 2,
          requiredRole: 'Admin',
          subItems: [
            { id: '2-1', label: 'Car Wash', route: '/services/car-wash', icon: '🚗', order: 1, requiredRole: 'Admin' },
            { id: '2-2', label: 'Detailing', route: '/services/detailing', icon: '✨', order: 2, requiredRole: 'Admin' },
            { id: '2-3', label: 'Maintenance', route: '/services/maintenance', icon: '⚙️', order: 3, requiredRole: 'Admin' }
          ]
        },
        {
          id: '3',
          label: 'Workers',
          route: '/workers',
          icon: '👷',
          order: 3,
          requiredRole: 'Admin'
        },
        {
          id: '4',
          label: 'Orders',
          route: '/orders',
          icon: '📋',
          order: 4,
          requiredRole: 'Admin'
        },
        {
          id: '5',
          label: 'Customers',
          route: '/customers',
          icon: '👥',
          order: 5,
          requiredRole: 'Admin'
        },
        {
          id: '6',
          label: 'Settings',
          route: '/settings',
          icon: '⚙️',
          order: 6,
          requiredRole: 'Admin'
        }
      ];
    } else if (role === 'Worker') {
      // Worker-only navigation with task categories
      return [
        {
          id: '1',
          label: 'Dashboard',
          route: '/worker-dashboard',
          icon: '📊',
          order: 1,
          requiredRole: 'Worker'
        },
        {
          id: '2-1',
          label: 'New',
          route: '/worker-tasks/new',
          icon: '🆕',
          order: 2,
          requiredRole: 'Worker'
        },
        {
          id: '2-2',
          label: 'Pending',
          route: '/worker-tasks/pending',
          icon: '⏳',
          order: 3,
          requiredRole: 'Worker'
        },
        {
          id: '2-3',
          label: 'On Work',
          route: '/worker-tasks/on-work',
          icon: '⚙️',
          order: 4,
          requiredRole: 'Worker'
        },
        {
          id: '2-4',
          label: 'Complete',
          route: '/worker-tasks/complete',
          icon: '✅',
          order: 5,
          requiredRole: 'Worker'
        },
        {
          id: '3',
          label: 'Schedule',
          route: '/schedule',
          icon: '📅',
          order: 6,
          requiredRole: 'Worker'
        }
      ];
    } else {
      // User/Customer navigation
      return [
        {
          id: '1',
          label: 'Dashboard',
          route: '/app/user-dashboard',
          icon: '📊',
          order: 1,
          requiredRole: 'User'
        },
        {
          id: '2',
          label: 'Book Service',
          route: '/app/book-service',
          icon: '📋',
          order: 2,
          requiredRole: 'User'
        },
        {
          id: '3',
          label: 'Notifications',
          route: '/app/notifications',
          icon: '🔔',
          order: 3,
          requiredRole: 'User'
        },
        {
          id: '4',
          label: 'My Bookings',
          route: '/app/my-bookings',
          icon: '📅',
          order: 4,
          requiredRole: 'User'
        },
        {
          id: '5',
          label: 'My Vehicles',
          route: '/app/my-vehicles',
          icon: '🚗',
          order: 5,
          requiredRole: 'User'
        },
        {
          id: '6',
          label: 'Past Orders',
          route: '/app/past-orders',
          icon: '✅',
          order: 6,
          requiredRole: 'User'
        },
        {
          id: '7',
          label: 'Request Modification',
          route: '/app/request-modification',
          icon: '✏️',
          order: 7,
          requiredRole: 'User'
        },
        {
          id: '8',
          label: 'Payment Details',
          route: '/app/payment-details',
          icon: '💳',
          order: 8,
          requiredRole: 'User'
        }
      ];
    }
  }

  // Check if item should be visible based on role
  canViewItem(item: NavItem): boolean {
    if (!item.requiredRole) return true;
    return item.requiredRole === this.userRole;
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

  // Logout function
  logout(): void {
    localStorage.removeItem('userRole');
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
}
