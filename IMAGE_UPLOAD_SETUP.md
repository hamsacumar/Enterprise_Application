# 📸 Image Upload System Setup

## Overview
A complete image upload system has been set up for your AutoServeX website. This allows you to upload images that will be stored on the backend and served to your frontend.

---

## 🏗️ Architecture

```
Frontend (Angular)
    ↓
Image Upload Component
    ↓
HTTP Request to Backend API
    ↓
Backend (CoreService) - C# .NET
    ↓
ImageUploadController
    ↓
File System (/uploads/images/)
    ↓
MongoDB (stores image metadata - optional)
```

---

## 📁 Folder Structure Created

```
backend/CoreService/
├── Controllers/
│   └── ImageUploadController.cs          # NEW - Handles file uploads
├── uploads/
│   └── images/
│       └── .gitkeep                      # NEW - Ensures folder is tracked
├── Program.cs                             # UPDATED - Added static file serving
└── docker-compose.yml                    # UPDATED - Added volume for persistence

Frontend/src/app/features/Admin/pages/
└── image-upload/
    ├── image-upload.component.ts         # NEW - Upload component logic
    ├── image-upload.component.html       # NEW - Upload UI
    └── image-upload.component.css        # NEW - Upload styling
```

---

## 🚀 API Endpoints

### Upload Single Image
**POST** `/api/imageupload/upload`
```bash
curl -X POST http://localhost:5000/api/imageupload/upload \
  -F "file=@/path/to/image.jpg"
```

**Response:**
```json
{
  "message": "Image uploaded successfully",
  "fileName": "550e8400-e29b-41d4-a716-446655440000_image.jpg",
  "filePath": "/uploads/images/550e8400-e29b-41d4-a716-446655440000_image.jpg",
  "fileSize": 245678,
  "uploadedAt": "2024-01-15T10:30:00Z"
}
```

### Upload Multiple Images
**POST** `/api/imageupload/upload-multiple`
```bash
curl -X POST http://localhost:5000/api/imageupload/upload-multiple \
  -F "files=@image1.jpg" \
  -F "files=@image2.png" \
  -F "files=@image3.gif"
```

### Get All Uploaded Images
**GET** `/api/imageupload/list`
```bash
curl http://localhost:5000/api/imageupload/list
```

### Delete Image
**DELETE** `/api/imageupload/delete/{fileName}`
```bash
curl -X DELETE http://localhost:5000/api/imageupload/delete/550e8400-e29b-41d4-a716-446655440000_image.jpg
```

### Health Check
**GET** `/api/imageupload/health`
```bash
curl http://localhost:5000/api/imageupload/health
```

---

## 🖼️ Using Uploaded Images

### In HTML:
```html
<img src="http://localhost:5000/uploads/images/550e8400-e29b-41d4-a716-446655440000_image.jpg" alt="Service Image">
```

### In Angular Component:
```typescript
export class LandingComponent {
  services = [
    {
      id: 1,
      name: 'Car Wash',
      image: 'http://localhost:5000/uploads/images/car-wash.jpg'
    }
  ];
}
```

### In Template:
```html
<div class="service-card" *ngFor="let service of services">
  <img [src]="service.image" [alt]="service.name">
  <h3>{{ service.name }}</h3>
</div>
```

---

## ⚙️ Configuration

### File Size Limit
Currently set to **5MB per file**. To change:

Edit `ImageUploadController.cs` line 47:
```csharp
if (file.Length > 5 * 1024 * 1024)  // Change 5 to your desired MB
```

### Allowed File Types
Currently: `.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`

To add more types, edit `ImageUploadController.cs` line 52:
```csharp
var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg" };
```

### Upload Folder Location
- **Development:** `backend/CoreService/uploads/images/`
- **Docker:** Mounted to `/app/uploads/`

---

## 🔧 How to Use the Upload Interface

### Step 1: Access the Upload Component
Add this route to your admin section:
```typescript
{ path: 'image-upload', component: ImageUploadComponent, title: 'Admin | Image Upload' }
```

### Step 2: Upload Images
1. Click the upload area or select files
2. Choose one or multiple images (JPG, PNG, GIF, WEBP)
3. Click "Upload Files" button
4. Watch the progress bar

### Step 3: Copy Image URLs
1. Once uploaded, images appear in the gallery
2. Click "Copy URL" button to get the image link
3. Paste in your code or database

### Step 4: Manage Images
- **Delete:** Remove unwanted images
- **Preview:** See image thumbnail before use
- **Info:** View file size and upload date

---

## 🐳 Docker Integration

The setup is fully Docker-compatible:

### Persist Uploads
The `docker-compose.yml` has been updated to mount the uploads folder:
```yaml
core-service:
  volumes:
    - ./backend/CoreService/uploads:/app/uploads
```

This ensures uploaded images persist even after container restart.

### Run with Docker
```bash
docker-compose up --build
```

---

## 📝 Backend Implementation Details

### Program.cs Changes
```csharp
// Create uploads folder if it doesn't exist
var uploadsPath = Path.Combine(app.Environment.ContentRootPath, "uploads", "images");
if (!Directory.Exists(uploadsPath))
{
    Directory.CreateDirectory(uploadsPath);
}

// Serve static files from uploads folder
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new Microsoft.Extensions.FileProviders.PhysicalFileProvider(
        Path.Combine(app.Environment.ContentRootPath, "uploads")),
    RequestPath = "/uploads"
});
```

### Controller Features
- ✅ Single file upload
- ✅ Multiple file upload
- ✅ File validation (type, size)
- ✅ Unique filename generation (GUID)
- ✅ Error handling
- ✅ Security checks
- ✅ List all images
- ✅ Delete images
- ✅ Health check endpoint

---

## 🔒 Security Features

1. **File Type Validation:** Only images accepted
2. **File Size Limit:** 5MB max per file
3. **Unique Filenames:** GUID prevents overwrites
4. **Path Security:** Prevents directory traversal attacks
5. **CORS Enabled:** Controlled cross-origin access

---

## 🎯 Example: Adding Images to Landing Page

### Update LandingComponent
```typescript
export class LandingComponent {
  services = [
    {
      id: 1,
      icon: '🚗',
      title: 'Car Wash',
      description: 'Professional washing',
      image: 'http://localhost:5000/uploads/images/car-wash.jpg'
    }
  ];
}
```

### Update Template
```html
<div class="service-card" *ngFor="let service of services">
  <img [src]="service.image" [alt]="service.title" class="service-image">
  <h3>{{ service.title }}</h3>
  <p>{{ service.description }}</p>
</div>
```

### Add CSS
```css
.service-image {
  width: 100%;
  height: 250px;
  object-fit: cover;
  border-radius: 8px 8px 0 0;
}
```

---

## 🐛 Troubleshooting

### Images Not Uploading
- Check backend is running: `http://localhost:5000/api/imageupload/health`
- Verify file size is under 5MB
- Check file format is allowed

### Images Not Displaying
- Verify frontend URL: `http://localhost:5000/uploads/images/...`
- Check CORS is enabled
- Ensure backend is serving static files

### Uploads Lost After Restart
- Docker volume not mounted properly
- Check `docker-compose.yml` has uploads volume
- Ensure path is correct

### Permission Denied Error
- Folder permissions issue
- Run: `chmod 755 backend/CoreService/uploads`
- Or restart Docker with proper permissions

---

## 📊 Best Practices

### Image Optimization
```bash
# Before uploading, optimize images:
- Compress JPGs: 70-85% quality
- Use WebP format for better compression
- Resize large images to max 1920px width
- Aim for under 500KB per image
```

### Naming Convention
```
car-wash-main.jpg
service-detailing-1.png
team-john-smith.jpg
logo-autoservex.png
```

### Directory Organization (Future)
```
uploads/
├── images/
│   ├── services/
│   ├── gallery/
│   ├── team/
│   └── logos/
```

---

## 🚀 Production Deployment

For production, consider:

1. **AWS S3 Storage**
   - Scalable cloud storage
   - CDN integration
   - Better performance

2. **Image Optimization Service**
   - ImageSharp (.NET library)
   - Automatic compression
   - Format conversion

3. **Database Integration**
   - Store metadata in MongoDB
   - Link images to services/products
   - Track upload history

---

## 📞 API Examples

### Using HttpClient in Angular
```typescript
constructor(private http: HttpClient) {}

uploadImage(file: File): Observable<any> {
  const formData = new FormData();
  formData.append('file', file);
  
  return this.http.post(
    'http://localhost:5000/api/imageupload/upload',
    formData
  );
}

getImages(): Observable<any> {
  return this.http.get(
    'http://localhost:5000/api/imageupload/list'
  );
}
```

### Using curl
```bash
# Upload
curl -X POST http://localhost:5000/api/imageupload/upload \
  -F "file=@car-wash.jpg"

# Get all images
curl http://localhost:5000/api/imageupload/list

# Delete
curl -X DELETE http://localhost:5000/api/imageupload/delete/filename.jpg
```

---

## ✅ Setup Checklist

- [x] ImageUploadController created
- [x] Program.cs updated for static file serving
- [x] docker-compose.yml updated with volumes
- [x] uploads/images folder created
- [x] Frontend ImageUploadComponent created
- [x] Upload UI/UX implemented
- [x] API endpoints working
- [x] Documentation complete

---

## 📞 Next Steps

1. **Start the application:**
   ```bash
   docker-compose up --build
   ```

2. **Access upload interface:**
   - Add route to your admin section
   - Navigate to image-upload component

3. **Upload your first image:**
   - Click upload area
   - Select an image
   - Click "Upload"
   - Copy the URL

4. **Add to Landing Page:**
   - Update LandingComponent with image URLs
   - Test on browser
   - Optimize images as needed

---

**Created:** November 7, 2025
**System:** AutoServeX Image Upload
**Status:** ✅ Ready for Use

