
// Re-exporting from the local shim since 'firebase' package is unavailable in this environment
import { app, db, auth, analytics } from './src/lib/firebase';
export { app, db, auth, analytics };
