
import { storage, ref, uploadBytes, getDownloadURL } from '../lib/firebase';

/**
 * Uploads a file to Firebase Storage and returns the download URL.
 * @param file The Javascript File object to upload.
 * @param path The path in storage (e.g. 'posts/image1.jpg').
 */
export const uploadImage = async (file: File, path: string): Promise<string> => {
  try {
    // Create a reference to the file location
    const storageRef = ref(storage, path);
    
    // Upload the file
    const snapshot = await uploadBytes(storageRef, file);
    
    // Get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return downloadURL;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw new Error("Failed to upload image. Please try again.");
  }
};
