import axios from 'axios';
import { containRssValidator } from '../validators/index.js';
import parseRssXml from './parser.js';
import { setDataToState, clearData } from './utils.js';

// Address for catch connection error:
// https://cors-anywhere.herokuapp.com/http://lorem-rss.herokuapp.com/feed

const requestDelay = 5000;

const buildAddressWithProxy = (address) => `https://hexlet-allorigins.herokuapp.com/get?disableCache=true&url=${address}`;

const updateFeeds = (state) => {
  Promise.all(state.feedsAddresses.map((address) => axios.get(buildAddressWithProxy(address))))
    .then(axios.spread((...data) => data.map((elem) => parseRssXml(elem.data.contents))))
    .then((rssFeedData) => {
      clearData(state);
      rssFeedData.forEach((dataItem) => {
        setDataToState(dataItem, state);
      });
      const watchedState = state;
      watchedState.status = 'refresh';
    })
    .then(() => setTimeout(updateFeeds, requestDelay, state))
    .catch((err) => {
      const { message } = err;
      const watchedState = state;
      watchedState.errors.requestError = message;
      watchedState.status = 'requestError';
    });
};

export default (address, state) => axios.get(buildAddressWithProxy(address))
  .then((response) => containRssValidator().validate(response))
  .then((response) => parseRssXml(response.data.contents))
  .then((content) => {
    setDataToState(content, state);
    const watchedState = state;
    watchedState.status = 'fulfilled';
  })
  .then(() => setTimeout(updateFeeds, requestDelay, state))
  .catch((err) => {
    const { message } = err;
    const watchedState = state;
    watchedState.errors.requestError = message;
    watchedState.status = 'requestError';
  });
