# MongoDB Atlas Setup Guide

## Current Configuration

Your CoreService is now configured to connect to **MongoDB Atlas** (Cloud MongoDB).

### Connection Details:
- **Username:** Thishok
- **Cluster:** cluster0
- **Region:** etlnxbr
- **Database:** Enterprise
- **Connection String Format:**
```
mongodb+srv://Thishok:<db_password>@cluster0.etlnxbr.mongodb.net/?appName=Cluster0
```

## Setup Instructions

### Step 1: Get Your Password
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign in to your account
3. Navigate to **Database Access** → **Database Users**
4. Find user "Thishok" and click **Edit**
5. Click **Edit Password** to reset or view your password
6. Copy the password

### Step 2: Update Configuration Files

Replace `<db_password>` in both files with your actual MongoDB password:

**File 1:** `appsettings.json`
```json
"MongoDbSettings": {
  "ConnectionString": "mongodb+srv://Thishok:YOUR_PASSWORD@cluster0.etlnxbr.mongodb.net/?appName=Cluster0",
  "DatabaseName": "Enterprise"
}
```

**File 2:** `appsettings.Development.json`
```json
"MongoDbSettings": {
  "ConnectionString": "mongodb+srv://Thishok:YOUR_PASSWORD@cluster0.etlnxbr.mongodb.net/?appName=Cluster0",
  "DatabaseName": "Enterprise"
}
```

### Step 3: Verify Connection

After updating the connection string:

1. **Rebuild the project:**
```bash
dotnet clean
dotnet build
```

2. **Run the application:**
```bash
dotnet run
```

3. **Test the Contact API:**
```bash
curl -X POST http://localhost:5000/api/contact/submit \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "+1-800-555-0000",
    "subject": "Test Submission",
    "message": "This is a test message from MongoDB Atlas",
    "serviceType": "general"
  }'
```

4. **Check MongoDB Atlas:**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Navigate to **Databases** → **Cluster0** → **Collections**
   - Look for database `Enterprise` and collection `Contacts`
   - Your submission should appear there!

## Security Best Practices

### 🔒 Never Commit Passwords to Git!

**IMPORTANT:** Do NOT commit your actual password to the repository.

**Option 1: Use Environment Variables (Recommended)**

Set environment variable before running:
```bash
# Windows PowerShell
$env:MONGO_URI = "mongodb+srv://Thishok:YOUR_PASSWORD@cluster0.etlnxbr.mongodb.net/?appName=Cluster0"

# Windows CMD
set MONGO_URI=mongodb+srv://Thishok:YOUR_PASSWORD@cluster0.etlnxbr.mongodb.net/?appName=Cluster0

# Linux/Mac
export MONGO_URI="mongodb+srv://Thishok:YOUR_PASSWORD@cluster0.etlnxbr.mongodb.net/?appName=Cluster0"
```

The Program.cs checks for `MONGO_URI` environment variable first:
```csharp
var envMongo = Environment.GetEnvironmentVariable("MONGO_URI");
var connectionString = envMongo ?? mongoSettings?.ConnectionString ?? throw new Exception("MongoDB connection string missing");
```

**Option 2: Use Azure Key Vault / AWS Secrets Manager**
- For production deployments
- Securely store connection strings
- Automatically rotated passwords

**Option 3: Local User Secrets (Development Only)**
```bash
dotnet user-secrets set "MongoDbSettings:ConnectionString" "mongodb+srv://Thishok:YOUR_PASSWORD@cluster0.etlnxbr.mongodb.net/?appName=Cluster0"
```

## Troubleshooting

### Connection Timeout
**Error:** `Timeout connecting to server`

**Solutions:**
1. Check your MongoDB Atlas password is correct
2. Verify your IP address is whitelisted in MongoDB Atlas:
   - Go to **Network Access** → **IP Whitelist**
   - Add your IP address or use 0.0.0.0/0 for development (NOT for production!)

### Authentication Failed
**Error:** `Authentication failed`

**Solutions:**
1. Verify username "Thishok" is correct
2. Check password has no special characters that need URL encoding
3. If password has special characters, URL encode them:
   - `@` → `%40`
   - `#` → `%23`
   - `:` → `%3A`
   - etc.

### Database Not Found
**Error:** `Database 'Enterprise' not found`

**Solutions:**
1. MongoDB Atlas creates databases automatically on first write
2. Try submitting a contact form to create the database
3. Check MongoDB Atlas that database appears after submission

### No Collections Appear
**Solution:**
1. Submit a contact form via the API
2. Collections are created automatically on first insert
3. Check back in MongoDB Atlas after submission

## Connection String Breakdown

```
mongodb+srv://Thishok:PASSWORD@cluster0.etlnxbr.mongodb.net/?appName=Cluster0
│            │     │        │      │                       │   │
│            │     │        │      │                       │   └─ Application name
│            │     │        │      │                       └───── Query parameters
│            │     │        │      └──────────────────────────── Cluster domain
│            │     │        └─────────────────────────────────── Cluster ID
│            │     └──────────────────────────────────────────── Password
│            └────────────────────────────────────────────────── Username
└─────────────────────────────────────────────────────────────── MongoDB SRV connection
```

## Useful MongoDB Atlas Links

- **Cluster Dashboard:** https://cloud.mongodb.com/v2/
- **Database Access:** https://cloud.mongodb.com/v2/DATABASE_ID/security/database/users
- **Network Access:** https://cloud.mongodb.com/v2/DATABASE_ID/security/network/networkAccess
- **Backups:** https://cloud.mongodb.com/v2/DATABASE_ID/backups

## Next Steps

1. ✅ Update connection string with your password
2. ✅ Test the API endpoint
3. ✅ Verify data appears in MongoDB Atlas
4. ✅ Set up environment variables for production
5. ✅ Configure IP whitelist for your servers

## Support

If you encounter issues:

1. Check the application logs for detailed error messages
2. Verify MongoDB Atlas cluster status (must be "ACTIVE")
3. Check your internet connection
4. Verify firewall isn't blocking connections to MongoDB Atlas
5. Contact MongoDB Atlas support: support@mongodb.com

