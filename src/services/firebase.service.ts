import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

// Prevent multiple initializations
if (!admin.apps.length) {
    try {
        // In production, use standard GOOGLE_APPLICATION_CREDENTIALS
        // For local development, you might want to load from a specific path or env var
        // admin.initializeApp({
        //   credential: admin.credential.cert(serviceAccount), // If using JSON file
        // });

        // Default initialization (looks for GOOGLE_APPLICATION_CREDENTIALS env var)
        admin.initializeApp();
        console.log('🔥 Firebase Admin initialized successfully');
    } catch (error) {
        console.error('Firebase admin initialization error', error);
    }
}

export const auth = admin.auth();
export default admin;
