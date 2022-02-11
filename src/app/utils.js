export const setDataToState = (data, state) => {
  const feed = Object.entries(data).reduce((acc, [key, value]) => (key.includes('items') ? acc : {
    ...acc,
    [key]: value,
  }), {});
  const posts = data.items;
  const watchedState = state;
  watchedState.feedsData.posts = [...posts, ...state.feedsData.posts];
  watchedState.feedsData.feeds = [feed, ...state.feedsData.feeds];
};

export const clearData = (state) => {
  const watchedState = state;
  watchedState.feedsData.posts = [];
  watchedState.feedsData.feeds = [];
};
