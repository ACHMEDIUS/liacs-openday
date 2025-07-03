import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyCsdjJmmHggPLxcR4TBkVKkWdHotbLGDS0',
  authDomain: 'liacs-openday.firebaseapp.com',
  projectId: 'liacs-openday',
  storageBucket: 'liacs-openday.firebasestorage.app',
  messagingSenderId: '190434404800',
  appId: '1:190434404800:web:eed490f17d86c7400cc025',
  measurementId: 'G-X2VDZQ5KMQ',
};

let firebaseApp: FirebaseApp;
if (!getApps().length) {
  firebaseApp = initializeApp(firebaseConfig);
} else {
  firebaseApp = getApps()[0];
}

export default firebaseApp;

// Export a Firestore instance
export const db = getFirestore(firebaseApp);
