import onChange from 'on-change';

const createButton = (postId, i18nInstance) => {
  const button = document.createElement('button');
  button.setAttribute('type', 'button');
  button.setAttribute('name', 'detailsButton');
  button.setAttribute('data-bs-toggle', 'modal');
  button.setAttribute('data-bs-target', '#rssDetailsModal');
  button.setAttribute('data-postId', postId);
  button.classList.add('btn', 'btn-outline-primary', 'ms-1');
  button.textContent = i18nInstance.t('buttons.moreButton');
  return button;
};

const createCard = () => {
  const card = document.createElement('div');
  card.classList.add('card', 'border-0');
  const cardTitle = document.createElement('h5');
  cardTitle.classList.add('card-title');
  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body', 'm-0');
  cardBody.append(cardTitle);
  card.append(cardBody);
  return { card, cardTitle, cardBody };
};

const createFeedsList = (value) => {
  const list = document.createElement('ul');
  value.forEach((feed) => {
    const feedElement = document.createElement('li');
    const header = document.createElement('h3');
    const description = document.createElement('p');
    description.classList.add('m-0', 'small', 'text-black-50');
    header.classList.add('h6');
    header.textContent = feed.title;
    description.textContent = feed.description;
    feedElement.classList.add('list-group-item', 'm-b-1');
    list.append(header);
    list.append(description);
  });

  return list;
};

const isCheckedPost = (post, postIds) => postIds.includes(post.guid);

const createPostsList = (posts, checkedPostsIds, i18Instance) => {
  const list = document.createElement('ul');
  posts.forEach((post) => {
    const postElement = document.createElement('li');
    const referenceElem = document.createElement('a');
    referenceElem.classList.add(isCheckedPost(post, checkedPostsIds) ? 'fw-normal' : 'fw-bold');
    referenceElem.setAttribute('href', post.link);
    referenceElem.textContent = post.title;
    postElement.classList.add(
      'list-group-item',
      'd-flex',
      'justify-content-between',
      'align-items-center',
      'border-0',
      'border-end-0',
      'pr-3',
    );
    postElement.append(referenceElem);
    const moreButton = createButton(post.guid, i18Instance);
    postElement.append(moreButton);
    list.append(postElement);
  });

  return list;
};

const render = (container, watchedState, i18Instance, property) => {
  container.innerHTML = '';
  const { card, cardTitle, cardBody } = createCard();
  cardTitle.textContent = i18Instance.t(`contentHeader.${property}`);

  const { checkedPostsIds } = watchedState;

  const listMapping = {
    posts: (posts) => createPostsList(posts, checkedPostsIds, i18Instance),
    feeds: (feeds) => createFeedsList(feeds),
  };

  const list = listMapping[property](watchedState.feedsData[property]);

  container.append(card);
  cardBody.append(list);
};

export default (state, i18Instance) => {
  const input = document.querySelector('input');
  const formErrorContainer = document.querySelector('.invalid-feedback');

  const watchedState = onChange(state, (path, value) => {
    input.classList.remove('is-invalid');
    if (path === 'errors.formError' && value.length) {
      formErrorContainer.textContent = i18Instance.t(value) || '';
      input.classList.add('is-invalid');
    }

    if (path === 'selectedPost' && value) {
      const modalTitle = document.querySelector('.modal-title');
      const modalBody = document.querySelector('.modal-body');
      const readMoreButton = document.querySelector('#readMoreButton');
      readMoreButton.setAttribute('href', value.link);
      modalTitle.textContent = value.title;
      modalBody.textContent = value.description;
    }

    const properties = Object.keys(watchedState.feedsData);
    const isValid = watchedState.status === 'valid';

    properties.forEach((prop) => {
      const container = document.querySelector(`.${prop}`);
      if (isValid) {
        render(container, watchedState, i18Instance, prop);
        input.value = '';
      }
    });
  });

  return watchedState;
};
