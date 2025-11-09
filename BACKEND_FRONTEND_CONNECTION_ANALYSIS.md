# Backend-Frontend Connection Analysis

## Current Situation

### ✅ Backend (UserDashboard) - READY
**Location:** `Backend/UserDashboard/`

#### Controllers Available:
1. **VehiclesController** (`/api/Vehicles`)
   - `GET /api/Vehicles` - Get all vehicles
   - `GET /api/Vehicles/{id}` - Get vehicle by ID
   - `POST /api/Vehicles` - Create new vehicle
   - `PUT /api/Vehicles/{id}` - Update vehicle
   - `DELETE /api/Vehicles/{id}` - Delete vehicle

2. **AppointmentsController** (`/api/Appointments`)
   - `GET /api/Appointments` - Get all appointments
   - `GET /api/Appointments/{id}` - Get appointment by ID
   - `POST /api/Appointments` - Create new appointment
   - `PUT /api/Appointments/{id}/status` - Update appointment status

#### Data Models:
- **Vehicle**: Id, Name, Model, Year, RegNumber, Type, Color
- **Appointment**: Id, CustomerName, PhoneNumber, Status, SpecialInstructions, VehicleId, VehicleName, VehicleModel, VehicleYear, VehicleRegNumber, VehicleType, SelectedServicesJson, TotalPriceLkr, CreatedAtUtc

---

### ❌ Frontend - USING MOCK DATA
**Location:** `Frontend/src/app/features/User/`

#### Current Implementation:
- **MockData Service** (`Frontend/src/app/services/mock-data.ts`)
  - Uses `BehaviorSubject` (in-memory data)
  - No HTTP calls to backend
  - All data is hardcoded/mock

#### Components Using MockData:
1. **my-vehicles.ts** - Uses `getMyVehicles()`, `addVehicle()`, `updateVehicle()`, `deleteVehicle()`
2. **book-service.ts** - Uses `getAvailableServices()`, `getMyVehicles()`, `createAppointment()`
3. **dashboard.ts** - Uses `getSummary()`, `getOngoingServices()`
4. **services.ts** - Uses `getAppointments()`
5. **notification-dialog.ts** - Uses `getAppointment()`, `updateAppointmentStatus()`
6. **notifications.ts** - Uses `getAppointment()`

---

## Connection Gap

### Problem:
- Frontend uses **MockData** service with in-memory data
- Backend has **RESTful APIs** ready to use
- **No HTTP connection** between frontend and backend

### Solution Required:
1. Create HTTP service to connect to backend APIs
2. Replace MockData with real HTTP calls OR update MockData to use HttpClient
3. Create TypeScript interfaces matching backend models
4. Configure API base URL (http://localhost:5000)

---

## API Endpoint Mapping

### Vehicles API
| Frontend Method | Backend Endpoint | HTTP Method |
|----------------|-----------------|--------------|
| `getMyVehicles()` | `/api/Vehicles` | GET |
| `addVehicle()` | `/api/Vehicles` | POST |
| `updateVehicle()` | `/api/Vehicles/{id}` | PUT |
| `deleteVehicle()` | `/api/Vehicles/{id}` | DELETE |

### Appointments API
| Frontend Method | Backend Endpoint | HTTP Method |
|----------------|-----------------|--------------|
| `getAppointments()` | `/api/Appointments` | GET |
| `getAppointment(id)` | `/api/Appointments/{id}` | GET |
| `createAppointment()` | `/api/Appointments` | POST |
| `updateAppointmentStatus()` | `/api/Appointments/{id}/status` | PUT |

### Missing Backend Endpoints:
- `getAvailableServices()` - Currently returns hardcoded data (needs backend endpoint)
- `getSummary()` - Currently calculated from in-memory data (needs backend endpoint)
- `getOngoingServices()` - Currently returns empty (needs backend endpoint or filter)
- `getPastOrders()` - Not in backend (needs backend endpoint)
- `getPayments()` - Not in backend (needs backend endpoint)

---

## Implementation Plan

### Step 1: Create TypeScript Interfaces
- `Vehicle` interface matching backend model
- `Appointment` interface matching backend model
- `ServiceItem` interface for services
- `CreateAppointmentDto` interface

### Step 2: Create HTTP Service
- Create `UserDashboardService` using `HttpClient`
- Implement all CRUD operations for Vehicles
- Implement all CRUD operations for Appointments
- Handle errors properly

### Step 3: Update MockData Service
- Option A: Replace MockData with UserDashboardService
- Option B: Update MockData to use HttpClient (keep same interface)

### Step 4: Configure API Base URL
- Set base URL: `http://localhost:5000`
- Consider environment configuration

### Step 5: Update Components
- Ensure all components work with new service
- Add proper error handling
- Test all CRUD operations

---

## Data Flow

### Current Flow (Mock):
```
Component → MockData → BehaviorSubject → Component
```

### Target Flow (Real):
```
Component → UserDashboardService → HttpClient → Backend API → SQL Server
                ↓
         Observable → Component
```

---

## Issues to Address

1. **Service Availability**: `getAvailableServices()` returns hardcoded data - needs backend endpoint
2. **Summary Calculation**: `getSummary()` calculates from in-memory - needs backend endpoint
3. **Ongoing Services**: Currently empty - needs filtering by status
4. **Past Orders**: Not in backend - needs new endpoint or derive from appointments
5. **Payments**: Not in backend - needs new endpoint or separate service

---

## Next Steps

1. ✅ Create TypeScript interfaces
2. ✅ Create UserDashboardService with HttpClient
3. ✅ Update MockData to use HttpClient (backward compatible)
4. ⚠️ Add missing backend endpoints OR handle in frontend
5. ⚠️ Test all connections
6. ⚠️ Add error handling and loading states

