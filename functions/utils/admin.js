const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://social-ape-97c74.firebaseio.com'
});

const db = admin.firestore();

module.exports = { admin, db };
