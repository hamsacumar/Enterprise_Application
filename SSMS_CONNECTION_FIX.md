# Fix SSMS Certificate Trust Error

## Quick Fix for SSMS Connection

### Method 1: Using Connection Options (Easiest)

1. **Open SQL Server Management Studio**
2. **Connect to Server dialog appears**
3. **Enter Server name**: `localhost\SQLEXPRESS01`
4. **Select Authentication**: 
   - Choose **SQL Server Authentication**
   - Enter your **Login** (username)
   - Enter your **Password**
5. **Click "Options >>" button** (bottom right)
6. **Go to "Additional Connection Parameters" tab**
7. **Add this line**:
   ```
   TrustServerCertificate=True;
   ```
8. **Click Connect**

---

### Method 2: Using Connection String

1. **Open SQL Server Management Studio**
2. **Click Connect → Database Engine**
3. **Click "Options >>" button**
4. **Go to "Additional Connection Parameters" tab**
5. **Enter full connection string**:
   ```
   Server=localhost\SQLEXPRESS01;TrustServerCertificate=True;User Id=YOUR_USERNAME;Password=YOUR_PASSWORD;
   ```
   Replace `YOUR_USERNAME` and `YOUR_PASSWORD` with your actual credentials
6. **Click Connect**

---

### Method 3: Save Connection with Trust Certificate

1. **Connect using Method 1 or 2 above**
2. **Once connected, right-click your server in Object Explorer**
3. **Select "Properties"**
4. **Go to "Connection" page**
5. **In "Additional connection parameters"**, add:
   ```
   TrustServerCertificate=True;
   ```
6. **Click OK**
7. **Future connections will use this setting**

---

## For Docker Connection String

Your `docker-compose.yml` already has `TrustServerCertificate=True`, so Docker connections should work fine.

The connection string format is:
```
Server=host.docker.internal,1433;Database=AutoserveX;User Id=YOUR_USERNAME;Password=YOUR_PASSWORD;TrustServerCertificate=True;
```

---

## Why This Error Occurs

SQL Server uses a self-signed certificate for encrypted connections. By default, SSMS doesn't trust self-signed certificates. Adding `TrustServerCertificate=True` tells the client to trust the server's certificate without validation.

**Note**: This is safe for development environments. For production, you should use a proper SSL certificate from a trusted Certificate Authority.

