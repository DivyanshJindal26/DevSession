const admin = require('firebase-admin')

// Initialize Firebase Admin once — same pattern as the Python backend
// firebase-creds.json is the service account key downloaded from Firebase Console
if (!admin.apps.length) {
  const credsJson = process.env.FIREBASE_CREDS_JSON
  const serviceAccount = credsJson
    ? JSON.parse(credsJson)
    : require('./firebase-creds.json')
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  })
}

/**
 * Express middleware. Reads the Bearer token from the Authorization header,
 * verifies it with Firebase, and attaches req.uid before calling next().
 */
const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = await admin.auth().verifyIdToken(token)
    req.uid = decoded.uid
    next()
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' })
  }
}

module.exports = { verifyToken }
