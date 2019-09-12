import axios from 'axios';
import {
  SET_SCREAMS,
  LOADING_DATA,
  LIKE_SCREAM,
  UNLIKE_SCREAM,
  DELETE_SCREAM,
  LOADING_UI,
  STOP_LOADING_UI,
  POST_SCREAM,
  SET_ERRORS,
  CLEAR_ERRORS,
  SET_SCREAM,
  SUBMIT_COMMENT
} from '../types';

export const getScreams = () => dispatch => {
  dispatch({ type: LOADING_DATA });
  axios
    .get('/screams')
    .then(res => {
      dispatch({ type: SET_SCREAMS, payload: res.data });
    })
    .catch(() => {
      dispatch({ type: SET_SCREAMS, payload: [] });
    });
};

export const getScream = screamId => dispatch => {
  dispatch({ type: LOADING_UI });
  axios
    .get(`/screams/${screamId}`)
    .then(res => {
      dispatch({ type: SET_SCREAM, payload: res.data });
      dispatch({ type: STOP_LOADING_UI });
    })
    .catch(err => console.log(err));
};

export const postScream = newScream => dispatch => {
  dispatch({ type: LOADING_UI });
  axios
    .post('/screams', newScream)
    .then(res => {
      dispatch({ type: POST_SCREAM, payload: res.data });
      dispatch(clearErrors());
    })
    .catch(err => {
      dispatch({ type: SET_ERRORS, payload: err.response.data });
    });
};

export const likeScream = screamId => dispatch => {
  axios
    .get(`/screams/${screamId}/like`)
    .then(res => {
      dispatch({ type: LIKE_SCREAM, payload: res.data });
    })
    .catch(err => console.log(err));
};

export const unlikeScream = screamId => dispatch => {
  axios
    .get(`/screams/${screamId}/unlike`)
    .then(res => {
      dispatch({ type: UNLIKE_SCREAM, payload: res.data });
    })
    .catch(err => console.log(err));
};

export const submitComment = (screamId, commentData) => dispatch => {
  axios
    .post(`/screams/${screamId}/comments`, commentData)
    .then(res => {
      dispatch({ type: SUBMIT_COMMENT, payload: res.data });
      dispatch(clearErrors());
    })
    .catch(err => {
      dispatch({ type: SET_ERRORS, payload: err.response.data });
    });
};

export const deleteScream = screamId => dispatch => {
  axios
    .delete(`/screams/${screamId}`)
    .then(() => {
      dispatch({ type: DELETE_SCREAM, payload: screamId });
    })
    .catch(err => console.log(err));
};

export const getUserData = userHandle => dispatch => {
  dispatch({ type: LOADING_DATA });
  axios
    .get(`/user/${userHandle}`)
    .then(res => {
      dispatch({ type: SET_SCREAMS, payload: res.data.screams });
    })
    .catch(() => {
      dispatch({ type: SET_SCREAMS, payload: null });
    });
};

export const clearErrors = () => dispatch => {
  dispatch({ type: CLEAR_ERRORS });
};
