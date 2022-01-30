import './styles/style.css';
import axios from 'axios';
import i18next from 'i18next';
import { setLocale } from 'yup';
import resources from './locales';
import initView from './app/view';
import { feedDoublesValidator, formValidator, containRssValidator } from './validators';
import parseRssXml from './app/parser';
import 'bootstrap';

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

  const buildAddressWithProxy = (address) => `https://hexlet-allorigins.herokuapp.com/get?url=${encodeURIComponent(address)}`;

  const setDataToState = (data) => {
    const feed = Object.entries(data).reduce((acc, [key, value]) => (key.includes('items') ? acc : {
      ...acc,
      [key]: value,
    }), {});
    const posts = data.items;
    watchedState.feedsData.posts = [...posts, ...state.feedsData.posts];
    watchedState.feedsData.feeds = [feed, ...state.feedsData.feeds];
  };

  const clearData = () => {
    watchedState.feedsData.posts = [];
    watchedState.feedsData.feeds = [];
  };

  // const setErrorToState = (error) => {
  //   watchedState.errors.requestErrors.push(error);
  // }
  //
  // const clearRequestErrors = () => {
  //   watchedState.errors.requestErrors = [];
  // }
  const requestDelay = 5000;

  const requestData = (addresses) => {
    Promise.all(addresses.map((address) => axios.get('https://cors-anywhere.herokuapp.com/http://lorem-rss.herokuapp.com/feed')))
      .then(axios.spread((...data) => data.map((elem) => parseRssXml(elem.data.contents))))
      .then((rssFeedData) => {
        clearData();
        rssFeedData.forEach((dataItem) => {
          setDataToState(dataItem);
        });
      })
      .then(() => setTimeout(requestData, requestDelay, addresses))
      .catch((err) => {
        console.log(err.message);
        const { message } = err;
        watchedState.errors.requestError = message;
      });
  };

  const request = (address) => {
    axios.get(buildAddressWithProxy(address))
      .then((response) => containRssValidator().validate(response))
  };

  // let timerId = setTimeout(function request() {
  //   requestData(state.feedsAddresses);
  //   timerId = null;
  //   timerId = setTimeout(request, requestDelay);
  // }, requestDelay);

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const rssInputValue = formData.get('rssInput').trim();
    Promise.all([
      formValidator().validate({ rssInputValue }),
      feedDoublesValidator(state.feedsAddresses).validate(rssInputValue),
    ])
      // .then((data) => request([data]))
      .then(() => {
        watchedState.feedsAddresses.push(rssInputValue);
        watchedState.status = 'valid';
      })
      .then(() => {
        requestData(state.feedsAddresses);
      })
      .catch((err) => {
        console.log(err)
        const [error] = err.errors;
        watchedState.errors.formError = error;
      });
  });

  const getPost = (postId) => state.feedsData.posts.find((post) => post.guid === postId);

  const modal = document.querySelector('#rssDetailsModal');
  modal.addEventListener('show.bs.modal', (e) => {
    const button = e.relatedTarget;
    const { postid } = button.dataset;
    const selectedPost = getPost(postid);
    watchedState.checkedPostsIds.push(postid);
    watchedState.selectedPost = selectedPost;
  });
};

app();

export default app;
