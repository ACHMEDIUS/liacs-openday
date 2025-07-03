import { setGlobalOptions } from 'firebase-functions';
import { onRequest, onCall } from 'firebase-functions/v2/https';
import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import { defineSecret } from 'firebase-functions/params';
import * as admin from 'firebase-admin';
import * as logger from 'firebase-functions/logger';

// Define secrets with APP_ prefix
const appPrivateKey = defineSecret('APP_FIREBASE_PRIVATE_KEY');
const appClientEmail = defineSecret('APP_FIREBASE_CLIENT_EMAIL');

// Initialize Firebase Admin SDK (will be initialized inside functions with secrets)
let adminInitialized = false;

function initializeAdmin() {
  if (!adminInitialized && !admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: 'liacs-openday',
        clientEmail: appClientEmail.value(),
        privateKey: appPrivateKey.value().replace(/\\n/g, '\n'),
      }),
    });
    adminInitialized = true;
  }
}

setGlobalOptions({ maxInstances: 10 });

// Authentication Functions
export const verifyToken = onCall({ secrets: [appPrivateKey, appClientEmail] }, async request => {
  initializeAdmin();
  try {
    const { token } = request.data;

    if (!token) {
      throw new Error('No token provided');
    }

    const decodedToken = await admin.auth().verifyIdToken(token);
    return { success: true, uid: decodedToken.uid };
  } catch (error) {
    logger.error('Token verification failed:', error);
    throw new Error('Invalid token');
  }
});

// Login endpoint
export const login = onRequest(
  { cors: true, secrets: [appPrivateKey, appClientEmail] },
  async (req, res) => {
    initializeAdmin();
    if (req.method !== 'POST') {
      res.status(405).send('Method not allowed');
      return;
    }

    try {
      const { token } = req.body;

      if (!token) {
        res.status(400).json({ error: 'Missing token' });
        return;
      }

      await admin.auth().verifyIdToken(token);

      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7 * 1000, // 1 week
        path: '/',
      });

      res.json({ success: true });
    } catch (error) {
      logger.error('Login failed:', error);
      res.status(401).json({ error: 'Invalid token' });
    }
  }
);

// Logout endpoint
export const logout = onRequest({ cors: true }, async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).send('Method not allowed');
    return;
  }

  res.clearCookie('token', { path: '/' });
  res.json({ success: true });
});

// Q&A Functions
export const submitQuestion = onCall(
  { secrets: [appPrivateKey, appClientEmail] },
  async request => {
    initializeAdmin();
    try {
      const { question, userToken } = request.data;

      if (!userToken) {
        throw new Error('Authentication required');
      }

      await admin.auth().verifyIdToken(userToken);

      if (!question || !question.text) {
        throw new Error('Question text is required');
      }

      const questionData = {
        text: question.text,
        accepted: false,
        main: false,
        createdAt: admin.firestore.Timestamp.now(),
      };

      const docRef = await admin.firestore().collection('questions').add(questionData);

      return { success: true, id: docRef.id };
    } catch (error) {
      logger.error('Failed to submit question:', error);
      throw new Error('Failed to submit question');
    }
  }
);

export const getQuestions = onCall({ secrets: [appPrivateKey, appClientEmail] }, async request => {
  initializeAdmin();
  try {
    const { userToken } = request.data;

    if (!userToken) {
      throw new Error('Authentication required');
    }

    await admin.auth().verifyIdToken(userToken);

    const snapshot = await admin
      .firestore()
      .collection('questions')
      .where('accepted', '==', true)
      .orderBy('createdAt', 'desc')
      .get();

    const questions = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return { questions };
  } catch (error) {
    logger.error('Failed to get questions:', error);
    throw new Error('Failed to get questions');
  }
});

// Score tracking
export const updateScore = onCall({ secrets: [appPrivateKey, appClientEmail] }, async request => {
  initializeAdmin();
  try {
    const { userToken, score } = request.data;

    if (!userToken) {
      throw new Error('Authentication required');
    }

    const decodedToken = await admin.auth().verifyIdToken(userToken);
    const userId = decodedToken.uid;

    const scoreData = {
      userId,
      score,
      timestamp: admin.firestore.Timestamp.now(),
    };

    await admin.firestore().collection('scores').add(scoreData);

    return { success: true };
  } catch (error) {
    logger.error('Failed to update score:', error);
    throw new Error('Failed to update score');
  }
});

// Notification when new question is submitted
export const onQuestionSubmitted = onDocumentCreated('questions/{questionId}', event => {
  logger.info(`New question submitted: ${event.params.questionId}`);
  // You can add notification logic here (email, Slack, etc.)
});
