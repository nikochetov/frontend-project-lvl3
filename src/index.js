import './styles/style.css';
import axios from 'axios';
import i18next from 'i18next';
import { setLocale } from 'yup';
import resources from './locales';
import initView from './app/view';
import feedDoublesValidator from './validators/feedDoublesValidator';
import formValidator from './validators/rssUrlValidator';
import parser from './app/parser';
import { value } from 'lodash/seq';

const app = () => {
  const submitButton = document.querySelector('form');

  const i18nInstance = i18next.createInstance();

  const defaultLanguage = 'ru';

  i18nInstance.init({
    lng: defaultLanguage,
    debug: false,
    resources,
  });

  setLocale({
    mixed: {
      default: 'formErrors.required_field',
      required: 'formErrors.required_field',
      notOneOf: 'formErrors.exist_feed',
    },
    string: {
      url: 'formErrors.invalid_url',
    },
  });

  const state = {
    status: 'invalid',
    feedsData: {
      feedsAddresses: [],
      feeds: [],
      posts: [],
    },
    errors: {
      formError: '',
      requestErrors: [],
    },
    language: defaultLanguage,
  };

  const watchedState = initView(state, i18nInstance);

  const buildAddressWithProxy = (address) => `https://hexlet-allorigins.herokuapp.com/get?url=${encodeURIComponent(address)}`;

  const setDataToState = (data) => {
    const feed = Object.entries(data).reduce((acc, [key, value]) => (key.includes('items') ? acc : { ...acc, [key]: value }), {});
    const posts = data.items;
    watchedState.feedsData.posts = [...posts, ...state.feedsData.posts];
    watchedState.feedsData.feeds = [feed, ...state.feedsData.feeds];
  };

  const requestData = (address) => {
    axios.get(buildAddressWithProxy(address))
      .then((response) => parser(response.data.contents))
      .then((data) => setDataToState(data))
      .catch((err) => console.log(err.response));
  };

  submitButton.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = formData.get('rssInput');
    Promise.all([
      formValidator().validate({ name: data }),
      feedDoublesValidator(state.feedsData.feedsAddresses).validate(data),
    ])
      .then(([formValue]) => {
        watchedState.feedsData.feedsAddresses.push(formValue.name);
        requestData(formValue.name);
      })
      .catch((err) => {
        const [error] = err.errors;
        watchedState.errors.formError = error;
      });
  });
};

app();
