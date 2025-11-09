# Core Backend Service

## Overview
Main backend service for the Enterprise Application containing all core functionality:
- Authentication & Authorization
- Navigation Management
- Footer & Company Information
- User Management

## Structure
```
CoreService/
├── Controllers/
│   ├── AuthController.cs
│   ├── NavigationController.cs
│   └── FooterController.cs
├── Services/
│   ├── JwtService.cs
│   ├── NavigationService.cs
│   └── FooterService.cs
├── Models/
│   ├── User.cs
│   ├── Navigation.cs
│   └── Footer.cs
├── Properties/
│   └── launchSettings.json
├── Program.cs
├── backend.csproj
├── appsettings.json
├── appsettings.Development.json
├── README.md
└── package.json
```

## Features

### Authentication (AuthController)
- User login with JWT tokens
- Token validation and decoding
- User profile retrieval
- Role-based access control

### Navigation Management (NavigationController)
- Dynamic menu management
- Role-based filtering
- Multi-level sub-menus
- Active/inactive status control
- Custom menu ordering

### Footer Management (FooterController)
- Multiple footer sections
- Dynamic link management
- Company information management
- Social media links support

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/decode` - Decode JWT token
- `GET /api/auth/users` - Get all users (Admin)
- `GET /api/auth/profile` - Get user profile

### Navigation
- `GET /api/navigation/all` - Get all items (Admin)
- `GET /api/navigation/by-role?userRole=Admin` - Get by role
- `GET /api/navigation/{id}` - Get single item
- `POST /api/navigation/create` - Create (Admin)
- `PUT /api/navigation/update/{id}` - Update (Admin)
- `DELETE /api/navigation/delete/{id}` - Delete (Admin)
- `PATCH /api/navigation/toggle-status/{id}` - Toggle (Admin)
- `POST /api/navigation/{id}/add-subitem` - Add sub-item (Admin)
- `DELETE /api/navigation/{id}/remove-subitem` - Remove sub-item (Admin)

### Footer
- `GET /api/footer/all` - Get all sections + company info
- `GET /api/footer/sections` - Get sections
- `GET /api/footer/company-info` - Get company info
- `POST /api/footer/sections/create` - Create section (Admin)
- `PUT /api/footer/sections/update/{id}` - Update section (Admin)
- `DELETE /api/footer/sections/delete/{id}` - Delete section (Admin)
- `POST /api/footer/sections/{id}/add-link` - Add link (Admin)
- `DELETE /api/footer/sections/{id}/remove-link/{id}` - Remove link (Admin)
- `PUT /api/footer/company-info/update` - Update company info (Admin)

## Running the Service

### Development
```bash
cd CoreService
dotnet run
```

### Build
```bash
dotnet build -c Release
```

### Publish
```bash
dotnet publish -c Release -o ./publish
```

## Port
Default: `https://localhost:7100`

## Configuration
- `appsettings.json` - Production settings
- `appsettings.Development.json` - Development settings
- `launchSettings.json` - Launch configuration

## Authentication
JWT tokens required for admin operations. Include in Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Default Credentials
```
Admin: admin@autowash.com / admin123
Worker: worker@autowash.com / worker123
User: user@autowash.com / user123
```

## Default Data
- 5 navigation items
- 4 footer sections
- ~12 footer links
- Company information

