import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

interface Task {
  id: number;
  customer: string;
  service: string;
  time: string;
  status: 'New' | 'Pending' | 'On Work' | 'Complete';
  description?: string;
  priority?: 'Low' | 'Medium' | 'High';
}

@Component({
  selector: 'app-worker-tasks',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './worker-tasks.component.html',
  styleUrls: ['./worker-tasks.component.css']
})
export class WorkerTasksComponent implements OnInit {
  activeCategory: 'new' | 'pending' | 'on-work' | 'complete' = 'new';
  
  allTasks: Task[] = [
    { id: 1, customer: 'John Smith', service: 'Car Wash', time: '10:00 AM', status: 'New', priority: 'High' },
    { id: 2, customer: 'Sarah Johnson', service: 'Detailing', time: '11:30 AM', status: 'Pending', priority: 'Medium' },
    { id: 3, customer: 'Mike Chen', service: 'Maintenance', time: '2:00 PM', status: 'On Work', priority: 'Low' },
    { id: 4, customer: 'Emily Davis', service: 'Interior Cleaning', time: '3:30 PM', status: 'New', priority: 'Medium' },
    { id: 5, customer: 'Robert Wilson', service: 'Full Package', time: '4:00 PM', status: 'Pending', priority: 'High' },
    { id: 6, customer: 'Jessica Taylor', service: 'Car Wash', time: '9:00 AM', status: 'Complete', priority: 'Low' },
    { id: 7, customer: 'David Brown', service: 'Polishing', time: '1:00 PM', status: 'Complete', priority: 'Medium' },
  ];

  categoryCounts = {
    new: 0,
    pending: 0,
    'on-work': 0,
    complete: 0
  };

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Get the category from route params
    this.route.params.subscribe(params => {
      const category = params['category'];
      if (['new', 'pending', 'on-work', 'complete'].includes(category)) {
        this.activeCategory = category as 'new' | 'pending' | 'on-work' | 'complete';
      }
    });

    // Calculate counts for each category
    this.updateCategoryCounts();
  }

  updateCategoryCounts(): void {
    this.categoryCounts.new = this.allTasks.filter(t => t.status === 'New').length;
    this.categoryCounts.pending = this.allTasks.filter(t => t.status === 'Pending').length;
    this.categoryCounts['on-work'] = this.allTasks.filter(t => t.status === 'On Work').length;
    this.categoryCounts.complete = this.allTasks.filter(t => t.status === 'Complete').length;
  }

  getFilteredTasks(): Task[] {
    const statusMap = {
      'new': 'New',
      'pending': 'Pending',
      'on-work': 'On Work',
      'complete': 'Complete'
    };
    const status = statusMap[this.activeCategory];
    return this.allTasks.filter(task => task.status === status);
  }

  setActiveCategory(category: 'new' | 'pending' | 'on-work' | 'complete'): void {
    this.activeCategory = category;
  }

  selectCategory(category: string): void {
    if (['new', 'pending', 'on-work', 'complete'].includes(category)) {
      this.activeCategory = category as 'new' | 'pending' | 'on-work' | 'complete';
    }
  }

  startTask(taskId: number): void {
    const task = this.allTasks.find(t => t.id === taskId);
    if (task && task.status === 'New') {
      task.status = 'Pending';
      this.updateCategoryCounts();
    }
  }

  beginWork(taskId: number): void {
    const task = this.allTasks.find(t => t.id === taskId);
    if (task && task.status === 'Pending') {
      task.status = 'On Work';
      this.updateCategoryCounts();
    }
  }

  completeTask(taskId: number): void {
    const task = this.allTasks.find(t => t.id === taskId);
    if (task && task.status === 'On Work') {
      task.status = 'Complete';
      this.updateCategoryCounts();
    }
  }

  getPriorityIcon(priority?: string): string {
    switch (priority) {
      case 'High':
        return '🔴';
      case 'Medium':
        return '🟡';
      case 'Low':
        return '🟢';
      default:
        return '⚪';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'New':
        return '🆕';
      case 'Pending':
        return '⏳';
      case 'On Work':
        return '⚙️';
      case 'Complete':
        return '✅';
      default:
        return '📋';
    }
  }
}

