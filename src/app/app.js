import i18next from 'i18next';
import { setLocale } from 'yup';
import resources from '../locales/index.js';
import initView from './view.js';
import { formChangesHandler, formSubmitHandler, modalHandler } from './handlers.js';

export default () => {
  const form = document.querySelector('form');
  const input = document.querySelector('input');
  const postsContainer = document.querySelector('.posts');

  const i18nInstance = i18next.createInstance();

  const defaultLanguage = 'ru';

  i18nInstance.init({
    lng: defaultLanguage,
    debug: false,
    resources,
  });

  setLocale({
    mixed: {
      default: 'errors.formErrors.required_field',
      required: 'errors.formErrors.required_field',
      notOneOf: 'errors.formErrors.exist_feed',
    },
    string: {
      url: 'errors.formErrors.invalid_url',
    },
  });

  const state = {
    status: 'invalid',
    feedsAddresses: [],
    feedsData: {
      feeds: [],
      posts: [],
    },
    checkedPostsIds: [],
    selectedPost: null,
    errors: {
      formError: '',
      requestError: '',
    },
    language: defaultLanguage,
  };

  const watchedState = initView(state, i18nInstance);

  form.addEventListener('submit', formSubmitHandler(watchedState));

  postsContainer.addEventListener('click', (ev) => {
    const { postid } = ev.target.dataset;
    if (!postid) return;
    modalHandler(watchedState, postid);
  });

  input.addEventListener('input', formChangesHandler(watchedState));
};
