import { feedDoublesValidator, formValidator } from '../validators';
import request from './loader';

const getPost = (postId, state) => state.feedsData.posts.find((post) => post.guid === postId);

export const modalHandler = (state) => (event) => {
  const button = event.relatedTarget;
  const { postid } = button.dataset;
  const currentState = state;
  const selectedPost = getPost(postid, currentState);
  currentState.checkedPostsIds.push(postid);
  currentState.selectedPost = selectedPost;
  currentState.status = 'openModal';
};

export const formHandler = (state) => (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const rssInputValue = formData.get('url').trim();
  Promise.all([
    formValidator().validate({ rssInputValue }),
    feedDoublesValidator(state.feedsAddresses).validate(rssInputValue),
  ])
    .then(() => {
      request(rssInputValue, state);
    })
    .then(() => {
      const currentState = state;
      currentState.feedsAddresses.push(rssInputValue);
      currentState.errors.requestError = '';
    })
};
