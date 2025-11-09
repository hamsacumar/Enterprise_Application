# Landing Page Images Guide

## Overview
The landing page has been updated to use professional images instead of emojis. This guide explains where to place your images.

## Directory Structure

Create the following folder structure in your `src` directory:

```
src/
├── assets/
│   ├── services/
│   │   ├── car-wash.jpg
│   │   ├── detailing.jpg
│   │   ├── maintenance.jpg
│   │   ├── protection.jpg
│   │   ├── interior-cleaning.jpg
│   │   └── express-service.jpg
│   └── features/
│       ├── expert-technicians.jpg
│       ├── eco-friendly.jpg
│       ├── competitive-pricing.jpg
│       ├── time-efficient.jpg
│       ├── multiple-locations.jpg
│       └── quality-guarantee.jpg
```

## Image Specifications

### Services Images (6 images)
- **Location**: `src/assets/services/`
- **Recommended Size**: 400x300px or larger
- **Format**: JPG, PNG, or WebP
- **Suggested Images**:
  - `car-wash.jpg` - Professional car wash setup or clean vehicle
  - `detailing.jpg` - Detailed car or polishing in progress
  - `maintenance.jpg` - Mechanic working or maintenance tools
  - `protection.jpg` - Protected/glossy vehicle surface
  - `interior-cleaning.jpg` - Car interior being cleaned
  - `express-service.jpg` - Quick service or fast action

### Features Images (6 images)
- **Location**: `src/assets/features/`
- **Recommended Size**: 300x300px or larger (circular display)
- **Format**: JPG, PNG, or WebP
- **Suggested Images**:
  - `expert-technicians.jpg` - Professional team or person
  - `eco-friendly.jpg` - Green/natural elements or eco symbol
  - `competitive-pricing.jpg` - Calculator, money, or pricing chart
  - `time-efficient.jpg` - Clock, stopwatch, or speed symbol
  - `multiple-locations.jpg` - Map, locations, or building
  - `quality-guarantee.jpg` - Certificate, checkmark, or quality badge

## Image Properties

### Services Section
- **Container Size**: 150x150px with rounded corners
- **Display**: Rectangular with rounded corners (10px)
- **Hover Effect**: Zoom in slightly on hover
- **Background**: Gradient (sky blue to teal) - shows if image fails to load

### Features Section
- **Container Size**: 120x120px circular
- **Display**: Perfect circle with shadow
- **Hover Effect**: Zoom in on hover
- **Background**: Gradient (orange to purple) - shows if image fails to load

## How to Add Images

### Option 1: Add Images Manually
1. Create the `assets` folder in `src/` if it doesn't exist
2. Create `services` and `features` subfolders
3. Add your professional images with the specified filenames

### Option 2: Update Image Paths in Code
If you prefer different folder structure or filenames, update:

**File**: `src/app/features/landing/landing.component.ts`

```typescript
// Services section - update image paths
services = [
  {
    id: 1,
    image: 'assets/services/your-custom-path.jpg', // Change this
    title: 'Car Wash',
    description: '...'
  },
  // ... more services
];

// Features section - update image paths
features = [
  { 
    image: 'assets/features/your-custom-path.jpg', // Change this
    title: 'Expert Technicians', 
    description: '...' 
  },
  // ... more features
];
```

## Image Best Practices

### Quality
- Use high-quality, professional images
- Recommended resolution: At least 400x300px (services), 300x300px (features)
- Ensure images are crisp and clear

### Optimization
- Compress images to reduce file size (use tools like TinyPNG)
- Use modern formats: JPG for photos, PNG/WebP for graphics
- Recommended file size: 50-200KB per image

### Copyright & Licensing
- Use royalty-free images from sites like:
  - Unsplash
  - Pexels
  - Pixabay
  - Shutterstock (commercial)
  - iStock (commercial)

### Naming Convention
- Use lowercase filenames with hyphens: `car-wash.jpg`, `expert-team.jpg`
- Avoid spaces and special characters
- Be descriptive about the content

## CSS Styling

The images are already styled with:
- Responsive sizing
- Smooth hover animations (zoom effect)
- Gradient backgrounds as fallback
- Circular display for features (border-radius: 50%)
- Rectangular with rounded corners for services

You can customize the styling in:
**File**: `src/app/features/landing/landing.component.css`

### Modify Service Icons:
```css
.service-icon {
  width: 150px;        /* Change size */
  height: 150px;
  border-radius: 10px; /* Change roundness */
  background: linear-gradient(135deg, var(--primary-blue), var(--accent-teal));
}
```

### Modify Feature Icons:
```css
.feature-icon {
  width: 120px;        /* Change size */
  height: 120px;
  border-radius: 50%;  /* Change to 0 for square */
  background: linear-gradient(135deg, var(--accent-orange), var(--accent-purple));
}
```

## Troubleshooting

### Images not showing?
1. Check file paths match exactly (case-sensitive)
2. Verify images are in correct folders
3. Ensure file extensions are correct (.jpg, .png, etc.)
4. Check browser console for 404 errors

### Images look stretched or distorted?
- Ensure images are appropriate aspect ratio for their containers
- Services: Use landscape images (wider than tall)
- Features: Use square images (same width and height)

### Performance issues?
- Compress images using online tools
- Use modern formats (WebP) if possible
- Consider lazy loading for many images

## Next Steps

1. ✅ Create the `assets` folder structure
2. ✅ Add professional images with correct filenames
3. ✅ Run `ng serve` to test locally
4. ✅ Adjust CSS if needed for your specific images

