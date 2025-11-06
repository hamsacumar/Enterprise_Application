# Worker Sidebar - Quick Reference

## 🎯 Quick Start

### Login as Worker
```
Email: worker@example.com
Role: Worker
```

### Navigate to Tasks
Sidebar → My Tasks → Select Category

---

## 📊 Sidebar Structure

```
┌─────────────────────────────┐
│ 🚗 AutoWash Pro         [✕] │
├─────────────────────────────┤
│ 👤 Worker                   │
│    WORKER                   │
├─────────────────────────────┤
│ 📊 Dashboard                │
│ 📋 My Tasks              [▼] │
│  ├─ 🆕 New (2)              │  ← Click here!
│  ├─ ⏳ Pending (3)           │
│  ├─ ⚙️  On Work (1)         │
│  └─ ✅ Complete (5)         │
│ 📅 Schedule                 │
├─────────────────────────────┤
│ 🚪 Logout                   │
└─────────────────────────────┘
```

---

## 📱 Tasks Page Layout

### Category Selection (Top)

```
┌──────────────────────────────────────────────────────┐
│  👷 My Tasks                                          │
│  Track and manage your assigned tasks by status      │
└──────────────────────────────────────────────────────┘

┌────────────┬────────────┬────────────┬────────────┐
│     🆕     │     ⏳     │     ⚙️     │     ✅     │
│   New      │  Pending   │  On Work   │ Complete   │
│     2      │      3     │      1     │      5     │
└────────────┴────────────┴────────────┴────────────┘
              ↑ Click to filter
```

### Task Card (Example)

```
┌────────────────────────────────────────────────────┐
│ Car Wash                              🟡 Medium    │
│                                       Task #1      │
├────────────────────────────────────────────────────┤
│ 👤 Customer: John Smith                            │
│ 🕐 Time: 10:00 AM                                  │
│ 📝 Description: Exterior wash and tire cleaning   │
├────────────────────────────────────────────────────┤
│ [✋ Accept Task]  [View Details] [Share]           │
└────────────────────────────────────────────────────┘
```

---

## 🔄 Task Workflow

```
CREATE TASK
    ↓
    🆕 NEW
    ├─ ✋ Accept Task
    ↓
    ⏳ PENDING
    ├─ ▶️ Start Work
    ↓
    ⚙️ ON WORK
    ├─ ✅ Complete Task
    ↓
    ✅ COMPLETE
    └─ 👀 View Results
```

---

## 🎨 Color Legend

| Status | Color | Icon | Button |
|--------|-------|------|--------|
| New | Blue | 🆕 | ✋ Accept |
| Pending | Orange | ⏳ | ▶️ Start |
| On Work | Purple | ⚙️ | ✅ Complete |
| Complete | Green | ✅ | 👀 View |

---

## ⚡ Keyboard Shortcuts (Future)

| Key | Action |
|-----|--------|
| `1` | Show New tasks |
| `2` | Show Pending tasks |
| `3` | Show On Work tasks |
| `4` | Show Complete tasks |
| `?` | Show help |

---

## 🎯 URL Routes

| Route | View |
|-------|------|
| `/app/worker-dashboard` | Main dashboard |
| `/app/worker-tasks` | All new tasks (default) |
| `/app/worker-tasks/new` | New tasks only |
| `/app/worker-tasks/pending` | Pending tasks only |
| `/app/worker-tasks/on-work` | Currently working tasks |
| `/app/worker-tasks/complete` | Completed tasks |

---

## 📊 Task Counts

| Status | Badge | Count Example |
|--------|-------|---|
| 🆕 New | Blue circle | 2 new tasks |
| ⏳ Pending | Orange hourglass | 3 pending |
| ⚙️ On Work | Purple gear | 1 in progress |
| ✅ Complete | Green check | 5 completed |

---

## 💡 Tips & Tricks

1. **Quick Filter**: Click any category card to see only those tasks
2. **Task Details**: Hover over task card for more info
3. **Priority**: 🔴 Red = Urgent, 🟡 Yellow = Normal, 🟢 Green = Low
4. **Workflow**: Follow the natural progression (New → Pending → On Work → Complete)
5. **Mobile**: Sidebar toggles on small screens (click ☰)

---

## 🔔 Status Indicators

### Task Card Border Colors
- 🔵 **New Tasks** - Blue left border
- 🟠 **Pending Tasks** - Orange left border
- 🟣 **On Work Tasks** - Purple left border
- 🟢 **Completed Tasks** - Green left border

### Priority Badges
- 🔴 **High** - Urgent, complete ASAP
- 🟡 **Medium** - Normal priority
- 🟢 **Low** - Can wait

---

## 👤 Worker Profile

When logged in as a worker, you'll see:
- Your role as "WORKER" in the sidebar
- Access to your assigned tasks
- Task management tools
- Schedule view
- Dashboard with your stats

---

## ❓ FAQ

**Q: How do I accept a new task?**  
A: Go to New section, click "Accept Task" button

**Q: How do I mark a task complete?**  
A: Go to "On Work" section, click "Complete Task"

**Q: Can I see completed tasks?**  
A: Yes, go to "Complete" section to view all completed work

**Q: How do I reassign a task?**  
A: (Future feature) Contact your supervisor

**Q: Can I add notes to a task?**  
A: (Future feature) Coming soon in task details

---

## 📞 Contact Support

- **Dashboard Issue**: Check sidebar navigation
- **Task Not Showing**: Refresh the page
- **Button Not Working**: Try logging out and back in
- **Other Issues**: Contact your administrator

---

## 🎓 Training

This sidebar helps workers:
1. See all assigned tasks at a glance
2. Manage task workflow efficiently
3. Track their productivity
4. Stay organized with clear categorization
5. Prioritize urgent work

**Master the task management system to become a super worker! 🚀**

