import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // ✅ Import this

import {
  LucideAngularModule,
  LayoutDashboard,
  Briefcase,
  Users,
  ShoppingCart,
  UserCircle,
  Settings,
} from 'lucide-angular';

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  imports: [
    CommonModule,
    RouterModule, // ✅ Required for routerLink / routerLinkActive
    LucideAngularModule, // Optional: for icons
  ],
})
export class SidebarComponent {}
