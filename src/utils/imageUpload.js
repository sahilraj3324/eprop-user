import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '@/config/firebase';

/**
 * Upload multiple images to Firebase Storage
 * @param {FileList} files - Files to upload
 * @param {string} folder - Storage folder name ('properties' or 'items')
 * @param {function} onProgress - Progress callback function
 * @returns {Promise<string[]>} Array of download URLs
 */
export const uploadImages = async (files, folder, onProgress = () => {}) => {
  const uploadPromises = [];
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      throw new Error(`File ${file.name} is not an image`);
    }
    
    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error(`File ${file.name} is too large. Maximum size is 5MB`);
    }
    
    // Create unique filename
    const timestamp = Date.now();
    const fileName = `${timestamp}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
    const storageRef = ref(storage, `${folder}/${fileName}`);
    
    // Create upload task
    const uploadTask = uploadBytesResumable(storageRef, file);
    
    const uploadPromise = new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          onProgress(i, progress, file.name);
        },
        (error) => {
          console.error('Upload error:', error);
          reject(error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          } catch (error) {
            reject(error);
          }
        }
      );
    });
    
    uploadPromises.push(uploadPromise);
  }
  
  return Promise.all(uploadPromises);
};

/**
 * Delete an image from Firebase Storage
 * @param {string} imageUrl - The download URL of the image to delete
 * @returns {Promise<void>}
 */
export const deleteImage = async (imageUrl) => {
  try {
    // Extract the path from the download URL
    const pathMatch = imageUrl.match(/\/o\/(.+?)\?/);
    if (!pathMatch) {
      throw new Error('Invalid image URL');
    }
    
    const imagePath = decodeURIComponent(pathMatch[1]);
    const imageRef = ref(storage, imagePath);
    
    await deleteObject(imageRef);
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
};

/**
 * Get image preview URL from File object
 * @param {File} file - The file to preview
 * @returns {string} Object URL for preview
 */
export const getImagePreview = (file) => {
  return URL.createObjectURL(file);
};

/**
 * Validate image files
 * @param {FileList} files - Files to validate
 * @returns {Object} Validation result
 */
export const validateImages = (files) => {
  const errors = [];
  const validFiles = [];
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      errors.push(`${file.name} is not an image file`);
      continue;
    }
    
    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      errors.push(`${file.name} is too large (max 5MB)`);
      continue;
    }
    
    validFiles.push(file);
  }
  
  return { validFiles, errors };
}; 