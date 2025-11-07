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
      // Admin-only navigation: Services, Workers
      return [
        {
          id: '1',
          label: 'Services',
          route: '/app/admin/services',
          icon: '🔧',
          order: 1,
          requiredRole: 'Admin'
        },
        {
          id: '2',
          label: 'Workers',
          route: '/app/admin/workers',
          icon: '👷',
          order: 2,
          requiredRole: 'Admin'
        }
      ];
    } else if (role === 'Worker') {
      // Worker-only navigation
      return [
        {
          id: '1',
          label: 'Home',
          route: '/app',
          icon: '🏠',
          order: 1,
          requiredRole: 'Worker'
        }
      ];
    } else {
      // User/Customer navigation
      return [
        {
          id: '1',
          label: 'Home',
          route: '/app',
          icon: '🏠',
          order: 1,
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
