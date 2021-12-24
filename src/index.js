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
    feedsName: [],
    errors: {
      formError: '',
      requestErrors: [],
    },
    language: defaultLanguage,
  };

  const watchedState = initView(state, i18nInstance);

  const buildAddressWithProxy = (address) => `https://hexlet-allorigins.herokuapp.com/get?url=${encodeURIComponent(address)}`;

  const requestData = (address) => {
    axios.get(buildAddressWithProxy(address))
      .then((response) => parser(response.data.contents))
      .then((data) => console.log('parsed:::::;:::::', data))
      .catch((err) => console.log(err.response));
  };

  submitButton.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = formData.get('rssInput');
    Promise.all([
      formValidator().validate({ name: data }),
      feedDoublesValidator(state.feedsName).validate(data),
    ])
      .then(([formValue]) => {
        watchedState.feedsName.push(formValue.name);
        requestData(formValue.name);
      })
      .catch((err) => {
        const [error] = err.errors;
        watchedState.errors.formError = error;
      });
  });
};

app();
