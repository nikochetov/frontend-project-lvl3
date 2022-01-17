import './styles/style.css';
import axios from 'axios';
import i18next from 'i18next';
import { setLocale } from 'yup';
import resources from './locales';
import initView from './app/view';
import feedDoublesValidator from './validators/feedDoublesValidator';
import formValidator from './validators/rssUrlValidator';
import parser from './app/parser';

const app = () => {
  const form = document.querySelector('form');

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
    feedsAddresses: [],
    feedsData: {
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
    const feed = Object.entries(data).reduce((acc, [key, value]) => (key.includes('items') ? acc : {
      ...acc,
      [key]: value
    }), {});
    const posts = data.items;
    watchedState.feedsData.posts = [...posts, ...state.feedsData.posts];
    watchedState.feedsData.feeds = [feed, ...state.feedsData.feeds];
  };

  const clearData = () => {
    watchedState.feedsData.posts = [];
    watchedState.feedsData.feeds = [];
  }

  const setErrorToState = (error) => {
    watchedState.errors.requestErrors.push(error);
  }

  const clearRequestErrors = () => {
    watchedState.errors.requestErrors = [];
  }

  const requestData = (addresses) => {
    Promise.all(addresses.map((address) => axios.get(buildAddressWithProxy(address))))
      .then(axios.spread((...data) => {
        return data.map((elem) => {
          return parser(elem.data.contents);
        });
      }))
      .then((data) => {
        clearData();
        data.forEach((dataItem) => {
          if (!dataItem.status?.error) {
            setDataToState(dataItem);
          }
        })
      })
  };

  // const requestDelay = 5000;
  //
  // let timerId = setTimeout(function request() {
  //   requestData(state.feedsAddresses);
  //   timerId = null;
  //   timerId = setTimeout(request, requestDelay);
  // }, requestDelay);


  form.addEventListener('submit', (event) => {
    console.log(event.target)
    event.preventDefault();
    console.log(event)
    const formData = new FormData(event.target);
    const data = formData.get('rssInput');
    console.log(data)
    Promise.all([
      formValidator().validate({ name: data }),
      feedDoublesValidator(state.feedsAddresses).validate(data),
    ])
      .then(([formValue]) => {
        watchedState.feedsAddresses.push(formValue.name);
        watchedState.status = 'valid';
      })
      .then(() => {
        requestData(state.feedsAddresses);
      })
      .catch((err) => {
        const [error] = err.errors;
        watchedState.errors.formError = error;
      });
  });
};

app();
