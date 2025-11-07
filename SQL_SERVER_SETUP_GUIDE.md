# SQL Server Authentication Setup Guide

## Step 1: Enable SQL Server Authentication (Mixed Mode)

1. **Open SQL Server Management Studio (SSMS)**
   - Search for "SQL Server Management Studio" in Windows Start menu
   - Connect to your SQL Server instance (usually `localhost\SQLEXPRESS01`)

2. **Open Server Properties**
   - Right-click on your server name in Object Explorer (top of left panel)
   - Click **Properties**

3. **Enable Mixed Mode Authentication**
   - In the Properties window, click on **Security** in the left panel
   - Under "Server authentication", select:
     - ✅ **SQL Server and Windows Authentication mode** (Mixed Mode)
   - Click **OK**

4. **Restart SQL Server Service**
   - Press `Win + R`, type `services.msc`, press Enter
   - Find **SQL Server (SQLEXPRESS01)** or **SQL Server (MSSQLSERVER)**
   - Right-click → **Restart**

---

## Step 2: Find Your SQL Server Port Number

1. **Open SQL Server Configuration Manager**
   - Press `Win + R`, type `SQLServerManagerXX.msc` (where XX is your SQL Server version, e.g., `SQLServerManager16.msc`)
   - Or search "SQL Server Configuration Manager" in Start menu

2. **Navigate to TCP/IP Settings**
   - Expand **SQL Server Network Configuration**
   - Click **Protocols for SQLEXPRESS01** (or your instance name)
   - Right-click **TCP/IP** → **Properties**

3. **Find the Port**
   - Click the **IP Addresses** tab
   - Scroll down to **IPAll** section
   - Note the **TCP Port** number (usually `1433` or a dynamic port like `1434`, `1435`, etc.)
   - **Write this port number down** - you'll need it later!

4. **Enable TCP/IP (if not already enabled)**
   - In the same window, go to **Protocol** tab
   - Set **Enabled** to **Yes**
   - Click **OK**
   - **Restart SQL Server service** again (Step 1.4)

---

## Step 3: Create a SQL Server Login (Username & Password)

1. **Open SQL Server Management Studio**
   - Connect to your server instance

2. **Create New Login**
   - In Object Explorer, expand your server
   - Expand **Security** folder
   - Right-click **Logins** → **New Login...**

3. **Configure Login Details**
   - **Login name**: Enter a username (e.g., `docker_user` or `app_user`)
   - Select **SQL Server authentication** (radio button)
   - **Password**: Enter a strong password (e.g., `MySecurePassword123!`)
   - **Confirm password**: Re-enter the same password
   - **Uncheck** "Enforce password policy" (optional, for development only)
   - **Uncheck** "User must change password at next login" (optional)

4. **Set Default Database**
   - In the same window, click **User Mapping** in the left panel
   - Check the box next to your database: **AutoserveX**
   - In the "Database role membership" section, check:
     - ✅ **db_owner** (full access to the database)
     - OR **db_datareader** and **db_datawriter** (read/write only)

5. **Grant Server-Level Permissions (if needed)**
   - Click **Server Roles** in the left panel
   - For development, you can check **sysadmin** (full server access)
   - For production, use more restrictive permissions

6. **Click OK** to create the login

---

## Step 4: Test the Connection

1. **Test in SSMS**
   - In SSMS, click **Disconnect** (if connected)
   - Click **Connect** → **Database Engine**
   - **Server name**: `localhost\SQLEXPRESS01` (or your instance)
   - **Authentication**: Select **SQL Server Authentication**
   - **Login**: Enter your new username (e.g., `docker_user`)
   - **Password**: Enter your password
   - Click **Connect**
   - ✅ If it connects successfully, your login works!

2. **Test from Command Line (Optional)**
   - Open PowerShell or Command Prompt
   - Run:
     ```powershell
     sqlcmd -S localhost\SQLEXPRESS01 -U docker_user -P "YourPassword" -Q "SELECT @@VERSION"
     ```
   - Replace `docker_user` and `YourPassword` with your credentials
   - If it works, you'll see SQL Server version information

---

## Step 5: Configure Windows Firewall

1. **Open Windows Defender Firewall**
   - Press `Win + R`, type `wf.msc`, press Enter

2. **Create Inbound Rule**
   - Click **Inbound Rules** → **New Rule...**
   - Select **Port** → **Next**
   - Select **TCP**
   - Select **Specific local ports**: Enter your SQL Server port (e.g., `1433`)
   - Click **Next**
   - Select **Allow the connection** → **Next**
   - Check all profiles (Domain, Private, Public) → **Next**
   - Name: `SQL Server Port 1433` (or your port number)
   - Click **Finish**

---

## Step 6: Update docker-compose.yml

1. **Open docker-compose.yml** in your project

2. **Update the SQL_CONNECTION_STRING** (around line 56)
   - Replace `sa` with your new username
   - Replace `YourPassword` with your actual password
   - Replace `1433` with your actual port number (if different)
   - Replace `host.docker.internal` with your host IP if needed

   **Example:**
   ```yaml
   - SQL_CONNECTION_STRING=Server=host.docker.internal,1433;Database=AutoserveX;User Id=docker_user;Password=MySecurePassword123!;TrustServerCertificate=True;
   ```

   **For named instances, you might need:**
   ```yaml
   - SQL_CONNECTION_STRING=Server=host.docker.internal\SQLEXPRESS01,1433;Database=AutoserveX;User Id=docker_user;Password=MySecurePassword123!;TrustServerCertificate=True;
   ```

---

## Step 7: Test Docker Connection

1. **Rebuild and run the container:**
   ```powershell
   docker-compose up -d --build userdashboard
   ```

2. **Check container logs:**
   ```powershell
   docker-compose logs userdashboard
   ```

3. **If you see connection errors, verify:**
   - SQL Server service is running
   - Port number is correct
   - Username and password are correct
   - Windows Firewall allows the port
   - TCP/IP is enabled in SQL Server Configuration Manager

---

## Troubleshooting

### Error: "Cannot connect to SQL Server"
- ✅ Check SQL Server service is running
- ✅ Verify TCP/IP is enabled in SQL Server Configuration Manager
- ✅ Check Windows Firewall allows the port
- ✅ Verify port number is correct

### Error: "Login failed for user"
- ✅ Verify username and password are correct
- ✅ Ensure SQL Server Authentication is enabled (Mixed Mode)
- ✅ Check the user has permissions on the database

### Error: "Network is unreachable" from Docker
- ✅ Try using your host machine's IP address instead of `host.docker.internal`
  - Find IP: `ipconfig` → Use IPv4 address (e.g., `192.168.1.6`)
  - Update connection string: `Server=192.168.1.6,1433;...`
- ✅ Ensure `extra_hosts` is configured in docker-compose.yml

---

## Quick Reference

**Connection String Format:**
```
Server=host.docker.internal,PORT;Database=AutoserveX;User Id=USERNAME;Password=PASSWORD;TrustServerCertificate=True;
```

**Example:**
```
Server=host.docker.internal,1433;Database=AutoserveX;User Id=docker_user;Password=MySecurePassword123!;TrustServerCertificate=True;
```

