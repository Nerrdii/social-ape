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
    return db
      .doc(`/screams/${snapshot.data().screamId}`)
      .get()
      .then(doc => {
        if (
          doc.exists &&
          doc.data().userHandle !== snapshot.data().userHandle
        ) {
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
      .catch(err => {
        console.error(err);
      });
  });

exports.deleteNotificationOnUnlike = functions.firestore
  .document('likes/{id}')
  .onDelete(snapshot => {
    return db
      .doc(`/notifications/${snapshot.id}`)
      .delete()
      .catch(err => {
        console.error(err);
      });
  });

exports.createNotificationOnComment = functions.firestore
  .document('comments/{id}')
  .onCreate(snapshot => {
    return db
      .doc(`/screams/${snapshot.data().screamId}`)
      .get()
      .then(doc => {
        if (
          doc.exists &&
          doc.data().userHandle !== snapshot.data().userHandle
        ) {
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
      .catch(err => {
        console.error(err);
      });
  });

exports.onUserImageChange = functions.firestore
  .document('/users/{userId}')
  .onUpdate(change => {
    if (change.before.data().imageUrl !== change.after.data().imageUrl) {
      const batch = db.batch();
      return db
        .collection('screams')
        .where('userHandle', '==', change.after.data().handle)
        .get()
        .then(data => {
          data.forEach(doc => {
            const scream = db.doc(`/screams/${doc.id}`);
            batch.update(scream, { userImage: change.after.data().imageUrl });
          });

          return batch.commit();
        });
    } else {
      return true;
    }
  });

exports.onScreamDelete = functions.firestore
  .document('screams/{screamId}')
  .onDelete((snapshot, context) => {
    const screamId = context.params.screamId;
    const batch = db.batch();

    return db
      .collection('comments')
      .where('screamId', '==', screamId)
      .get()
      .then(data => {
        data.forEach(doc => {
          batch.delete(db.doc(`/comments/${doc.id}`));
        });

        return db
          .collection('likes')
          .where('screamId', '==', screamId)
          .get();
      })
      .then(data => {
        data.forEach(doc => {
          batch.delete(db.doc(`/likes/${doc.id}`));
        });

        return db
          .collection('notifications')
          .where('screamId', '==', screamId)
          .get();
      })
      .then(data => {
        data.forEach(doc => {
          batch.delete(db.doc(`/notifications/${doc.id}`));
        });

        return batch.commit();
      })
      .catch(err => {
        console.error(err);
      });
  });
