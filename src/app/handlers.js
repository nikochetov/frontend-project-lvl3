import { feedDoublesValidator, formValidator } from '../validators/index.js';
import request from './loader.js';

const getPost = (postId, state) => state.feedsData.posts.find((post) => post.guid === postId);

const errorHandler = (state, err) => {
  const currentState = state;
  if (err.isAxiosError) {
    const { message } = err;
    const watchedState = state;
    watchedState.errors.requestError = message;
    watchedState.status = 'requestError';
    return;
  }

  const [error] = err?.errors;
  currentState.errors.formError = error;
  currentState.status = 'formError';
};

export const modalHandler = (state) => (event) => {
  const button = event.relatedTarget;
  const { postid } = button.dataset;
  const currentState = state;
  const selectedPost = getPost(postid, currentState);
  currentState.checkedPostsIds.push(postid);
  currentState.selectedPost = selectedPost;
  currentState.status = 'openModal';
};

export const formSubmitHandler = (state) => (event) => {
  const currentState = state;
  currentState.status = 'submitted';
  event.preventDefault();
  const formData = new FormData(event.target);
  const rssInputValue = formData.get('url').trim();
  Promise.all([
    formValidator().validate({ rssInputValue }),
    feedDoublesValidator(state.feedsAddresses).validate(rssInputValue),
  ])
    .then(() => request(rssInputValue, state))
    .then(() => {
      currentState.feedsAddresses.push(rssInputValue);
      currentState.errors.requestError = '';
    })
    .catch((err) => errorHandler(currentState, err));
};

export const formChangesHandler = (state) => (event) => {
  const currentState = state;
  const { value } = event.target;
  if (value) currentState.status = 'typing';
};
