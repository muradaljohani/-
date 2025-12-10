
export const formatRelativeTime = (timestamp: any): string => {
  if (!timestamp) return 'Just now';

  // 1. Handle dummy data strings (e.g. "2m", "1h") - Prevent 'Invalid Date' crash
  if (typeof timestamp === 'string') {
      // If it's short (likely dummy relative time), just return it
      if (timestamp.length < 6 && !timestamp.includes(':') && !timestamp.includes('-')) {
         return timestamp;
      }
  }

  let date: Date;

  try {
    // 2. Handle Firestore Timestamp
    if (timestamp?.toDate && typeof timestamp.toDate === 'function') {
        date = timestamp.toDate();
    } else if (timestamp instanceof Date) {
        date = timestamp;
    } else {
        // 3. Handle ISO string or other date strings
        date = new Date(timestamp);
    }

    // 4. Validate Date
    if (isNaN(date.getTime())) {
        // If parsing failed (e.g. invalid string), fallback
        return typeof timestamp === 'string' ? timestamp : 'Just now';
    }
  } catch (e) {
    return 'Just now';
  }

  // 5. Calculate diff
  const now = new Date();
  const diff = (now.getTime() - date.getTime()) / 1000; // seconds

  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d`;

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};
