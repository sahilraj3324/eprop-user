# Firebase Setup Guide

This application uses Firebase Storage for image uploads. Follow these steps to set up Firebase for your project.

## 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter your project name (e.g., "eproperty-app")
4. Follow the setup wizard

## 2. Enable Firebase Storage

1. In your Firebase project console, go to "Storage"
2. Click "Get started"
3. Choose "Start in production mode" (recommended) or "Start in test mode"
4. Choose a Cloud Storage location (preferably close to your users)

## 3. Configure Storage Rules

Replace the default rules with these to allow authenticated uploads:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow uploads to properties and items folders
    match /properties/{imageId} {
      allow read: if true;
      allow write: if request.auth != null 
        && request.resource.size < 5 * 1024 * 1024  // 5MB limit
        && request.resource.contentType.matches('image/.*');
    }
    
    match /items/{imageId} {
      allow read: if true;
      allow write: if request.auth != null 
        && request.resource.size < 5 * 1024 * 1024  // 5MB limit
        && request.resource.contentType.matches('image/.*');
    }
  }
}
```

## 4. Get Firebase Configuration

1. Go to Project Settings (gear icon)
2. Scroll down to "Your apps" section
3. Click "Add app" and choose "Web" (</>) if you haven't already
4. Register your app with a nickname
5. Copy the config object

## 5. Environment Variables

Create a `.env.local` file in your project root and add:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

Replace the values with your actual Firebase configuration.

## 6. Test the Setup

1. Start your development server: `npm run dev`
2. Go to the property or item create page
3. Try uploading an image
4. Check your Firebase Storage console to see if files are uploaded

## Features Implemented

- ✅ Drag and drop image upload
- ✅ Multiple image support (up to 10 for properties, 5 for items)
- ✅ Image preview with removal option
- ✅ Upload progress indicators
- ✅ File validation (type and size)
- ✅ Error handling
- ✅ Loading states
- ✅ Firebase Storage integration
- ✅ Automatic file naming with timestamps

## Troubleshooting

### Images not uploading
- Check your Firebase Storage rules
- Verify environment variables are set correctly
- Check browser console for errors

### Permission denied errors
- Ensure Storage rules allow writes for authenticated users
- Check if user authentication is working

### Large file uploads failing
- Files are limited to 5MB each
- Check if your Storage rules have size limits

## File Structure

```
src/
├── config/
│   └── firebase.js          # Firebase configuration
├── utils/
│   └── imageUpload.js       # Image upload utilities
├── components/
│   └── ImageUpload.js       # Reusable upload component
└── app/
    ├── properties/
    │   ├── create/page.js   # Property creation with image upload
    │   └── edit/[id]/page.js # Property editing with image upload
    └── items/
        ├── create/page.js   # Item creation with image upload
        └── edit/[id]/page.js # Item editing with image upload
``` 