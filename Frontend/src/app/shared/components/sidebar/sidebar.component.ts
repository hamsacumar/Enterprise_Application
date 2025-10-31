import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  menuItems = [
    { icon: '🏠', label: 'Dashboard', active: true, badge: null },
    { icon: '📅', label: 'Appointments', active: false, badge: '8' },
    { icon: '🚗', label: 'My Vehicles', active: false, badge: null },
    { icon: '💧', label: 'Services', active: false, badge: null },
    { icon: '⏱️', label: 'Service History', active: false, badge: null },
    { icon: '💬', label: 'Messages', active: false, badge: '3' },
    { icon: '💳', label: 'Payments', active: false, badge: null },
    { icon: '⚙️', label: 'Settings', active: false, badge: null }
  ];

  isCollapsed = false;

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  setActive(index: number) {
    this.menuItems.forEach((item, i) => {
      item.active = i === index;
    });
  }
}

