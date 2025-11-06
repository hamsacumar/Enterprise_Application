import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkerTasksComponent } from './worker-tasks.component';

describe('WorkerTasksComponent', () => {
  let component: WorkerTasksComponent;
  let fixture: ComponentFixture<WorkerTasksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkerTasksComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WorkerTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should filter tasks by category', () => {
    component.activeCategory = 'new';
    const newTasks = component.getFilteredTasks();
    expect(newTasks.every(task => task.status === 'New')).toBeTruthy();
  });

  it('should update category counts', () => {
    component.updateCategoryCounts();
    expect(component.categoryCounts.new).toBeGreaterThanOrEqual(0);
    expect(component.categoryCounts.pending).toBeGreaterThanOrEqual(0);
    expect(component.categoryCounts['on-work']).toBeGreaterThanOrEqual(0);
    expect(component.categoryCounts.complete).toBeGreaterThanOrEqual(0);
  });

  it('should start a new task', () => {
    const task = component.allTasks.find(t => t.status === 'New');
    if (task) {
      component.startTask(task.id);
      expect(task.status).toBe('Pending');
    }
  });

  it('should begin work on a pending task', () => {
    const task = component.allTasks.find(t => t.status === 'Pending');
    if (task) {
      component.beginWork(task.id);
      expect(task.status).toBe('On Work');
    }
  });

  it('should complete an on-work task', () => {
    const task = component.allTasks.find(t => t.status === 'On Work');
    if (task) {
      component.completeTask(task.id);
      expect(task.status).toBe('Complete');
    }
  });
});

