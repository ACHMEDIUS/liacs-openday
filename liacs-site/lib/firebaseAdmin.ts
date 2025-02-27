import admin from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';

if (!admin.apps.length) {
  try {
    const serviceAccount = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), 'firebaseSdkData.json'), 'utf8')
    );

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    
    console.log('Firebase Admin SDK initialized successfully');
  } catch (error) {
    console.error('Firebase Admin SDK initialization error:', error);
  }
}

export { admin };
