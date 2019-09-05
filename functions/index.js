const functions = require('firebase-functions');
const firebase = require('firebase');
const express = require('express');
const config = require('./utils/config');
const fbAuth = require('./utils/fbAuth');

firebase.initializeApp(config);

const app = express();

const {
  getAllScreams,
  getScream,
  createScream
} = require('./handlers/screams');
const {
  signup,
  login,
  getUser,
  addUserDetails,
  uploadImage
} = require('./handlers/users');

app.get('/screams', getAllScreams);
app.get('/screams/:id', getScream);
app.post('/screams', fbAuth, createScream);
app.post('/signup', signup);
app.post('/login', login);
app.get('/user', fbAuth, getUser);
app.post('/user', fbAuth, addUserDetails);
app.post('/user/image', fbAuth, uploadImage);

exports.api = functions.https.onRequest(app);
