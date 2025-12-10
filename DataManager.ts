
import { db } from './firebaseConfig';
import { 
  collection, 
  getDocs, 
  addDoc, 
  serverTimestamp, 
  query, 
  orderBy 
} from './src/lib/firebase'; // Updated import source

// Define the shape of a Post
export interface PostData {
  id?: string;
  content: string;
  author: string;
  timestamp: any; // Firestore Timestamp
  likes: number;
}

// Collection reference
const postsCollectionRef = collection(db, 'posts');

/**
 * Fetches all posts from Firestore, ordered by timestamp descending.
 */
export const fetchPosts = async (): Promise<PostData[]> => {
  try {
    // Create a query to order by timestamp (newest first)
    // Note: You might need to create an index in Firebase Console for this query
    const q = query(postsCollectionRef, orderBy('timestamp', 'desc'));
    
    const querySnapshot = await getDocs(q);
    
    // Map the documents to our PostData interface
    const posts: PostData[] = querySnapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data(),
    })) as PostData[];

    return posts;
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
};

/**
 * Sends a new post to Firestore.
 */
export const sendPost = async (content: string, author: string): Promise<void> => {
  try {
    await addDoc(postsCollectionRef, {
      content: content,
      author: author,
      likes: 0,
      timestamp: serverTimestamp() // Let server set the time
    });
    console.log("Post added successfully");
  } catch (error) {
    console.error("Error adding post:", error);
    throw error;
  }
};
