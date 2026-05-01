import admin from 'firebase-admin';

// Initialize Firebase Admin SDK
const initializeFirebase = () => {
    try {
        if (!admin.apps.length) {
            admin.initializeApp({
                credential: admin.credential.cert({
                    projectId: process.env.FIREBASE_PROJECT_ID,
                    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
                    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                }),
            });
            console.log('✅ Firebase Admin initialized successfully');
        }
    } catch (error) {
        console.error('❌ Firebase Admin initialization error:', error);
        throw error;
    }
};

initializeFirebase();

export const firebaseAdmin = admin;
export const messaging = admin.messaging();
export const auth = admin.auth();
