import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxChartsModule, Color, ScaleType } from '@swimlane/ngx-charts';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NgxChartsModule],
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.css']
})
export class DashboardHomeComponent {
  // Summary Cards Data
  summaryCards = [
    { title: 'Total Customers', value: 235, icon: '👥', color: '#3b82f6' },
    { title: 'Total Workers', value: 12, icon: '🧑‍🔧', color: '#10b981' },
    { title: 'Total Orders', value: 460, icon: '🧾', color: '#f59e0b' },
    { title: 'Active Services', value: 7, icon: '🔧', color: '#ef4444' },
  ];

  // Line Chart Data (Orders over Time)
  ordersOverTime = [
    { name: 'Nov 1', value: 25 },
    { name: 'Nov 2', value: 30 },
    { name: 'Nov 3', value: 42 },
    { name: 'Nov 4', value: 33 },
    { name: 'Nov 5', value: 27 },
  ];

  // Pie Chart Data (Service Type Distribution)
  serviceTypeData = [
    { name: 'Oil Change', value: 40 },
    { name: 'Car Wash', value: 30 },
    { name: 'Tire Service', value: 20 },
    { name: 'Brake Repair', value: 10 },
  ];

  lineChartScheme: Color = {
    name: 'line',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#3b82f6']
  };

  pieChartScheme: Color = {
    name: 'pie',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444']
  };

  // Bar Chart Data (Monthly Revenue)
  barChartData = [
    { name: 'Jan', value: 12000 },
    { name: 'Feb', value: 14500 },
    { name: 'Mar', value: 13200 },
    { name: 'Apr', value: 15800 },
    { name: 'May', value: 17100 },
    { name: 'Jun', value: 16500 }
  ];

  barChartScheme: Color = {
    name: 'bar',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4']
  };

  selectedInfo: string | null = null;

  onSelect(event: any) {
    this.selectedInfo = `${event.name}: ${event.value}`;
  }
}
