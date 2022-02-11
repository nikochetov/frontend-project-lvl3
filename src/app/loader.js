import axios from 'axios';
import { containRssValidator } from '../validators';
import parseRssXml from './parser';
import { setDataToState, clearData } from './utils';

// Address for catch connection error:
// https://cors-anywhere.herokuapp.com/http://lorem-rss.herokuapp.com/feed

const requestDelay = 5000;

const buildAddressWithProxy = (address) => `https://hexlet-allorigins.herokuapp.com/get?url=${encodeURIComponent(address)}`;

const updateFeeds = (state) => {
  Promise.all(state.feedsAddresses.map((address) => axios.get(buildAddressWithProxy(address))))
    .then(axios.spread((...data) => data.map((elem) => parseRssXml(elem.data.contents))))
    .then((rssFeedData) => {
      clearData(state);
      rssFeedData.forEach((dataItem) => {
        setDataToState(dataItem, state);
      });
    })
    .then(() => setTimeout(updateFeeds, requestDelay, state))
    .catch((err) => {
      const { message } = err;
      const watchedState = state;
      watchedState.errors.requestError = message;
    });
};

export default (address, state) => {
  axios.get(buildAddressWithProxy(address))
    .then((response) => containRssValidator().validate(response))
    .then((response) => parseRssXml(response.data.contents))
    .then((content) => setDataToState(content, state))
    .then(() => setTimeout(updateFeeds, requestDelay, state));
};