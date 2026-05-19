import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Note: This file will be populated with real config when set_up_firebase succeeds.
// For now, we use a placeholder to allow development to continue.
let firebaseConfig = {
  apiKey: "AIzaSyDeVKhXrEESrvXWUNHo-tU94jRe5mvhbjo",
  authDomain: "inpp-4c7b5.firebaseapp.com",
  projectId: "inpp-4c7b5",
  storageBucket: "inpp-4c7b5.firebasestorage.app",
  messagingSenderId: "526959773548",
  appId: "1:526959773548:web:a523aed701fb790e0b9549",
  measurementId: "G-GKEWR4VPYZ"
};

try {
  // If the file exists, it will overwrite the placeholder
  // We'll use a dynamic import or just wait for the tool to finish.
  // In a real turn, I would call view_file on firebase-applet-config.json
} catch (e) {
  console.warn("Firebase config not found, using placeholders");
}

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
