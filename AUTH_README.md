# AutoWash Pro - JWT Authentication Guide

## Overview
This application uses JWT (JSON Web Token) for secure authentication and role-based access control between the .NET backend and Angular frontend.

## Architecture

### Backend (.NET Core)
- **Technology**: ASP.NET Core 9.0 with JWT Bearer Authentication
- **Location**: `backend/`
- **Port**: https://localhost:7176

### Frontend (Angular)
- **Technology**: Angular 19
- **Location**: `Frontend/`
- **Port**: http://localhost:4200

## User Roles
The system supports three user roles:
1. **Admin** - Full system access, user management, admin panel
2. **Worker** - Service management, reports, customer support
3. **User** - Customer features, appointments, vehicle management

## Demo Credentials

| Role   | Email                    | Password   |
|--------|--------------------------|------------|
| Admin  | admin@autowash.com       | admin123   |
| Worker | worker@autowash.com      | worker123  |
| User   | user@autowash.com        | user123    |

## Backend API Endpoints

### Authentication Endpoints (`/api/auth`)

#### 1. Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@autowash.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "1",
    "name": "Admin User",
    "email": "admin@autowash.com",
    "role": "Admin"
  }
}
```

#### 2. Decode Token
```http
POST /api/auth/decode
Content-Type: application/json

{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### 3. Get All Users (Categorized by Role)
```http
GET /api/auth/users
Authorization: Bearer {token}
```

#### 4. Get Profile
```http
GET /api/auth/profile
Authorization: Bearer {token}
```

## Frontend Implementation

### 1. Authentication Service (`auth.service.ts`)
- Login/Logout functionality
- JWT token management (localStorage)
- User state management (BehaviorSubject)
- Token validation and decoding
- Role-based access checks

### 2. HTTP Interceptor (`auth.interceptor.ts`)
Automatically adds JWT token to all HTTP requests:
```typescript
Authorization: Bearer {token}
```

### 3. Auth Guards
- `authGuard` - Protects routes requiring authentication
- `adminGuard` - Protects Admin-only routes
- `workerGuard` - Protects Worker-only routes

### 4. Components with Auth Integration

#### Navbar
- Displays user info when authenticated
- Shows login button when not authenticated
- Logout functionality
- User avatar with initials

#### Sidebar
- Role-based menu filtering
- Different menu items for Admin, Worker, User
- User profile display at bottom

#### Login Page
- Email/password login form
- Demo credentials for testing
- Error handling
- Loading states

## Role-Based Menu Access

### Admin Role
- Dashboard, Admin Panel, User Management, Appointments, Services, Service History, Messages, Payments, Reports, Settings

### Worker Role  
- Dashboard, Appointments, Services, Service History, Messages, Payments, Reports, Settings

### User Role
- Dashboard, Appointments, My Vehicles, Services, Service History, Messages, Payments, Settings

## Running the Application

### Start Backend (.NET)
```bash
cd backend
dotnet restore
dotnet run
```
Backend will run on: https://localhost:7176

### Start Frontend (Angular)
```bash
cd Frontend
npm install
npm start
```
Frontend will run on: http://localhost:4200

## Testing the Authentication

1. **Navigate to**: http://localhost:4200
2. **Click "Customer Login"** in the navbar
3. **Use demo credentials** (click on any demo credential to auto-fill)
4. **After login**, you'll see:
   - Your name and role in the navbar
   - Role-specific menu items in the sidebar
   - User profile at the bottom of sidebar

5. **Test different roles**:
   - Login as Admin to see all menu items
   - Login as Worker to see worker-specific items
   - Login as User to see customer-specific items

## JWT Token Structure

The JWT contains the following claims:
```json
{
  "Id": "1",
  "Name": "Admin User",
  "Email": "admin@autowash.com",
  "Role": "Admin",
  "exp": 1234567890
}
```

## Security Features

1. **Token Expiration**: Tokens expire after 24 hours
2. **HTTPS**: Backend uses HTTPS in production
3. **CORS**: Configured to accept requests only from Angular app
4. **Token Validation**: Backend validates token signature, issuer, and audience
5. **localStorage**: Frontend stores token securely in browser localStorage

## Development Notes

- Backend JWT Key is in `appsettings.json` (change in production!)
- Frontend API URL is in `auth.service.ts` (line 16)
- To add new protected routes, use guards in `app.routes.ts`
- To add new menu items, update `sidebar.component.ts`

## Next Steps

1. Create dashboard components for each role
2. Implement protected routes with guards
3. Add user registration functionality
4. Connect to real database (currently using mock data)
5. Implement refresh token mechanism
6. Add password reset functionality

---

**Built with ❤️ for Enterprise Application Development (EAD)**

