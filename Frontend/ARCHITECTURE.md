# Worker Sidebar Architecture

## 📐 Component Hierarchy

```
MainLayoutComponent
├── SidebarComponent ← UPDATED
│   ├── Navigation Items (role-based)
│   │   └── Worker Navigation
│   │       ├── 📊 Dashboard
│   │       ├── 📋 My Tasks (EXPANDED with submenu)
│   │       │   ├── 🆕 New
│   │       │   ├── ⏳ Pending
│   │       │   ├── ⚙️ On Work
│   │       │   └── ✅ Complete ← Routes to WorkerTasksComponent
│   │       └── 📅 Schedule
│   └── User Info Section
│
├── Content Area
│   └── Router Outlet
│       └── WorkerTasksComponent ← NEW
│           ├── Category Section
│           ├── Task List
│           └── Task Cards
│
└── Footer
```

---

## 🔄 Data Flow

```
Worker Login
    ↓
Auth Guard (check role = 'Worker')
    ↓
MainLayout + Sidebar
    ↓
Worker Navigation Menu
    ├─ Dashboard
    ├─ My Tasks (Submenu)
    │  ├─ New → Route: /worker-tasks/new
    │  ├─ Pending → Route: /worker-tasks/pending
    │  ├─ On Work → Route: /worker-tasks/on-work
    │  └─ Complete → Route: /worker-tasks/complete
    │
    └─ WorkerTasksComponent
       ├─ Read URL params (:category)
       ├─ Filter tasks by status
       ├─ Display category cards
       ├─ Show task list
       └─ Handle actions (Accept, Start, Complete)
```

---

## 📂 File Structure

```
Frontend/
├── src/app/
│   ├── shared/components/
│   │   └── sidebar/
│   │       ├── sidebar.component.ts ← MODIFIED
│   │       ├── sidebar.component.html
│   │       ├── sidebar.component.css
│   │       └── sidebar.component.spec.ts
│   │
│   ├── features/dashboard/
│   │   └── worker-tasks/  ← NEW FOLDER
│   │       ├── worker-tasks.component.ts ← NEW
│   │       ├── worker-tasks.component.html ← NEW
│   │       ├── worker-tasks.component.css ← NEW
│   │       └── worker-tasks.component.spec.ts ← NEW
│   │
│   └── app.routes.ts ← MODIFIED
│
└── Documentation/
    ├── WORKER_SIDEBAR_README.md ← NEW
    ├── QUICK_REFERENCE.md ← NEW
    ├── ARCHITECTURE.md ← THIS FILE
    └── IMPLEMENTATION_SUMMARY.md ← NEW
```

---

## 🔌 Component Connections

### SidebarComponent ↔ WorkerTasksComponent

```typescript
// Sidebar Navigation Configuration
interface NavItem {
  id: string;
  label: string;
  route: string;           // → /app/worker-tasks/:category
  icon: string;
  order: number;
  subItems?: NavItem[];
  requiredRole?: string;   // ← Only for Worker
}

// Router Navigation
[routerLink]="item.route"  // Click → Navigate to route

// WorkerTasksComponent receives route params
ActivatedRoute.params → :category value
↓
Filter tasks by category
↓
Display in UI
```

---

## 🎯 Routing Architecture

```
/app (MainLayout with Sidebar)
├── /worker-dashboard (WorkerDashboardComponent)
├── /worker-tasks (WorkerTasksComponent - default: new)
└── /worker-tasks/:category (WorkerTasksComponent)
    ├── /new → Show only NEW tasks
    ├── /pending → Show only PENDING tasks
    ├── /on-work → Show only ON WORK tasks
    └── /complete → Show only COMPLETE tasks
```

---

## 💾 State Management

```
WorkerTasksComponent State
│
├─ allTasks: Task[]
│  └─ Complete list of all tasks
│
├─ activeCategory: string
│  └─ Current selected category (new/pending/on-work/complete)
│
└─ categoryCounts: object
   ├─ new: number
   ├─ pending: number
   ├─ on-work: number
   └─ complete: number
```

---

## 🔄 Event Flow

### User Clicks Category Card

```
User clicks "Pending" card
        ↓
@click="setActiveCategory('pending')" triggers
        ↓
activeCategory = 'pending'
        ↓
Template updates *ngIf conditions
        ↓
getFilteredTasks() returns only PENDING tasks
        ↓
*ngFor="let task of getFilteredTasks()" updates
        ↓
UI displays only pending tasks
```

### User Clicks Action Button

```
User clicks "Start Work" button
        ↓
@click="beginWork(task.id)" triggers
        ↓
Find task in allTasks array
        ↓
Update task.status from 'Pending' → 'On Work'
        ↓
updateCategoryCounts() recalculates
        ↓
categoryCounts.pending--
categoryCounts['on-work']++
        ↓
UI updates task counts in category cards
        ↓
getFilteredTasks() refilters and updates display
```

---

## 🎨 Styling Architecture

```
worker-tasks.component.css
├── Root Variables
│  ├─ --primary-blue: #0052CC
│  ├─ --dark-blue: #003d99
│  ├─ --accent-orange: #FF6B35
│  ├─ --green: #27AE60
│  └─ ... (9 total color variables)
│
├── Component Sections
│  ├─ .worker-tasks-container (main wrapper)
│  ├─ .tasks-header (title section)
│  ├─ .category-section (category cards grid)
│  ├─ .category-card (individual card)
│  ├─ .active-category-title (current status)
│  ├─ .tasks-list (grid of tasks)
│  ├─ .task-card (individual task)
│  ├─ .task-header (task title area)
│  ├─ .task-details (customer info)
│  └─ .task-actions (buttons)
│
├── Responsive Media Queries
│  ├─ Tablet: @media (max-width: 768px)
│  └─ Mobile: @media (max-width: 480px)
│
└── Animations & Transitions
   ├─ @keyframes bounce (empty state)
   └─ @keyframes slideDown (submenu)
```

---

## 🔐 Security & Guards

```
Router
├── Auth Guard (verify login)
├── Role Check (verify role === 'Worker')
└── Route Access
    ├─ /worker-dashboard → Only Workers
    ├─ /worker-tasks → Only Workers
    └─ /worker-tasks/:category → Only Workers
```

---

## 🧪 Testing Architecture

```
WorkerTasksComponent Tests
├── Unit Tests
│  ├─ Component Creation
│  ├─ Task Filtering
│  ├─ Count Updates
│  ├─ Status Transitions
│  └─ Helper Methods
│
└── E2E Tests (Future)
   ├─ Category Navigation
   ├─ Task Actions
   ├─ Status Updates
   └─ UI Responsiveness
```

---

## 📡 Backend Integration Points

```
Current: Mock Data
├─ allTasks: Task[] (hardcoded)
└─ No API calls

Future: API Integration
├─ getWorkerTasks() → GET /api/v1/worker-tasks
├─ updateTaskStatus() → PATCH /api/v1/tasks/:id
└─ getTaskDetails() → GET /api/v1/tasks/:id
```

---

## 🎯 User Journey

```
1. WORKER LOGS IN
   └─ Email + Password submitted
   └─ Auth service validates credentials
   └─ User role set to 'Worker' in localStorage

2. REDIRECTED TO DASHBOARD
   └─ MainLayout component loads
   └─ Sidebar renders worker navigation

3. SIDEBAR DISPLAYS
   ├─ Dashboard link
   ├─ My Tasks (collapsible)
   │  ├─ New (2 tasks)
   │  ├─ Pending (3 tasks)
   │  ├─ On Work (1 task)
   │  └─ Complete (5 tasks)
   └─ Schedule link

4. WORKER CLICKS "My Tasks" → "Pending"
   └─ Navigation to /app/worker-tasks/pending
   └─ WorkerTasksComponent loads with category = 'pending'
   └─ Displays 3 pending tasks

5. WORKER CLICKS "Start Work"
   └─ beginWork(taskId) called
   └─ Task status changes: Pending → On Work
   └─ Counts update: Pending (2), On Work (2)
   └─ UI refreshes

6. WORKER CLICKS "Complete Task"
   └─ completeTask(taskId) called
   └─ Task status changes: On Work → Complete
   └─ Counts update: On Work (1), Complete (6)
   └─ UI refreshes

7. WORKER VIEWS COMPLETED WORK
   └─ Clicks "Complete" category
   └─ Sees all 6 completed tasks
   └─ Can view details and ratings
```

---

## 🚀 Performance Considerations

```
Optimization Strategies
├─ OnPush Change Detection (when implemented)
├─ Lazy loading for task details (future)
├─ Virtual scrolling for long lists (future)
├─ Memoization of filtered results (future)
└─ CSS containment for better performance
```

---

## 📊 Database Schema (Future)

```sql
tasks (
  id: int,
  worker_id: int,
  customer_id: int,
  service_id: int,
  status: enum('New','Pending','On Work','Complete'),
  priority: enum('Low','Medium','High'),
  scheduled_time: datetime,
  created_at: datetime,
  updated_at: datetime,
  description: text
)
```

---

## 🎯 Summary

This architecture provides:

✅ **Modular Design** - Separate components with single responsibility  
✅ **Role-Based Access** - Only workers see worker tasks  
✅ **Clean Routing** - Intuitive URL structure  
✅ **State Management** - Simple component-level state  
✅ **Responsive Design** - Works on all screen sizes  
✅ **Easy Maintenance** - Well-organized, documented code  
✅ **Backend Ready** - Structure prepared for API integration  

---

## 🔧 Future Enhancements

1. **State Management** - NgRx for complex state
2. **API Integration** - Connect to backend
3. **Real-time Updates** - WebSocket for live updates
4. **Advanced Filtering** - Search, sort, date range
5. **Task Details Modal** - Full task information
6. **Notifications** - Real-time task assignments
7. **Analytics Dashboard** - Productivity metrics
8. **Task Reassignment** - Manager reassignment capability

