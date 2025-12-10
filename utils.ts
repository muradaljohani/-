
export const formatRelativeTime = (timestamp: any): string => {
  if (!timestamp) return 'Just now';

  // Return the string as-is if it's already a formatted string (e.g. from dummy data "2m")
  if (typeof timestamp === 'string' && timestamp.length < 5) return timestamp;

  let date: Date;
  
  try {
    // Handle Firestore Timestamp
    if (timestamp?.toDate && typeof timestamp.toDate === 'function') {
        date = timestamp.toDate();
    } else {
        // Handle JS Date or ISO string
        date = new Date(timestamp);
    }
  } catch (e) {
    return 'Just now';
  }

  // Safety Check for Invalid Date
  if (isNaN(date.getTime())) {
      // If original was a string, return it, otherwise default
      return typeof timestamp === 'string' ? timestamp : 'Just now';
  }

  const now = new Date();
  const diff = (now.getTime() - date.getTime()) / 1000; // difference in seconds

  if (diff < 60) {
    return 'Just now';
  } else if (diff < 3600) {
    return `${Math.floor(diff / 60)}m`;
  } else if (diff < 86400) {
    return `${Math.floor(diff / 3600)}h`;
  } else {
    // Return formatted date (e.g., "Dec 10")
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
};
