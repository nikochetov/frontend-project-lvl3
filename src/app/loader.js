import axios from 'axios';
import { containRssValidator } from '../validators/index.js';
import { parseRssXml } from './parser.js';
import { setDataToState, clearData } from './utils.js';

// Address for catch connection error:
// https://cors-anywhere.herokuapp.com/http://lorem-rss.herokuapp.com/feed
// https://hexlet-allorigins.herokuapp.com/get?disableCache=true&url=https://ru.hexlet.io/lessons.rss

const requestDelay = 5000;

const buildAddressWithProxy = (address) => `https://hexlet-allorigins.herokuapp.com/get?disableCache=true&url=${address}`;

const sendRequest = (address) => axios.get(buildAddressWithProxy(address));

const updateFeeds = (state) => {
  Promise.all(state.feedsAddresses.map((address) => sendRequest(address, state)))
    .then(axios.spread((...data) => data.map((elem) => parseRssXml(elem.data.contents))))
    .then((rssFeedData) => {
      clearData(state);
      rssFeedData.forEach((dataItem) => {
        setDataToState(dataItem, state);
      });
      const watchedState = state;
      watchedState.status = 'refresh';
    })
    .then(() => setTimeout(updateFeeds, requestDelay, state));
};

export default (address, state) => sendRequest(address)
  .then((response) => response)
  .then((response) => containRssValidator().validate(response))
  .then((response) => parseRssXml(response.data.contents))
  .then((content) => {
    setDataToState(content, state);
    const watchedState = state;
    watchedState.status = 'fulfilled';
  })
  .then(() => setTimeout(updateFeeds, requestDelay, state));
