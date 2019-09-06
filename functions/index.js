const functions = require('firebase-functions');
const firebase = require('firebase');
const express = require('express');
const { db } = require('./utils/admin');
const config = require('./utils/config');
const fbAuth = require('./utils/fbAuth');

firebase.initializeApp(config);

const app = express();

const {
  getAllScreams,
  getScream,
  createScream,
  deleteScream,
  createComment,
  likeScream,
  unlikeScream
} = require('./handlers/screams');
const {
  signup,
  login,
  getAuthenticatedUser,
  getUserDetails,
  addUserDetails,
  uploadImage,
  markNotifications
} = require('./handlers/users');

app.get('/screams', getAllScreams);
app.get('/screams/:id', getScream);
app.post('/screams', fbAuth, createScream);
app.delete('/screams/:id', fbAuth, deleteScream);
app.post('/screams/:id/comments', fbAuth, createComment);
app.get('/screams/:id/like', fbAuth, likeScream);
app.get('/screams/:id/unlike', fbAuth, unlikeScream);
app.post('/signup', signup);
app.post('/login', login);
app.get('/user', fbAuth, getAuthenticatedUser);
app.get('/user/:handle', getUserDetails);
app.post('/user', fbAuth, addUserDetails);
app.post('/user/image', fbAuth, uploadImage);
app.post('/notifications', fbAuth, markNotifications);

exports.api = functions.https.onRequest(app);

exports.createNotificationOnLike = functions.firestore
  .document('likes/{id}')
  .onCreate(snapshot => {
    db.doc(`/screams/${snapshot.data().screamId}`)
      .get()
      .then(doc => {
        if (doc.exists) {
          return db.doc(`/notifications/${snapshot.id}`).set({
            createdAt: new Date().toISOString(),
            recipient: doc.data().userHandle,
            sender: snapshot.data().userHandle,
            type: 'like',
            read: false,
            screamId: doc.id
          });
        }
      })
      .then(() => {
        return;
      })
      .catch(err => {
        console.error(err);
        return;
      });
  });

exports.deleteNotificationOnUnlike = functions.firestore
  .document('likes/{id}')
  .onDelete(snapshot => {
    db.doc(`/notifications/${snapshot.id}`)
      .delete()
      .then(() => {
        return;
      })
      .catch(err => {
        console.error(err);
        return;
      });
  });

exports.createNotificationOnComment = functions.firestore
  .document('comments/{id}')
  .onCreate(snapshot => {
    db.doc(`/screams/${snapshot.data().screamId}`)
      .get()
      .then(doc => {
        if (doc.exists) {
          return db.doc(`/notifications/${snapshot.id}`).set({
            createdAt: new Date().toISOString(),
            recipient: doc.data().userHandle,
            sender: snapshot.data().userHandle,
            type: 'comment',
            read: false,
            screamId: doc.id
          });
        }
      })
      .then(() => {
        return;
      })
      .catch(err => {
        console.error(err);
        return;
      });
  });
