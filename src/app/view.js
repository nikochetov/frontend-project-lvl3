import onChange from 'on-change';

const createButton = (i18nInstance) => {
  const button = document.createElement('button');
  button.setAttribute('type', 'button');
  button.classList.add('btn', 'btn-outline-primary', 'ms-1');
  button.textContent = i18nInstance.t('buttons.moreButton');
  return button;
};

const createCard = () => {
  const card = document.createElement('div');
  card.classList.add('card', 'border-0');
  const cardHeader = document.createElement('div');
  cardHeader.classList.add('card-header');
  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');
  card.append(cardHeader, cardBody);
  return { card, cardHeader, cardBody };
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

const createPostsList = (value) => {
  const list = document.createElement('ul');
  value.forEach((post) => {
    const postElement = document.createElement('li');
    const referenceElem = document.createElement('a');
    referenceElem.setAttribute('href', post.link);
    referenceElem.textContent = post.title;
    postElement.classList.add(
      'list-group-item',
      'd-flex',
      'align-self-center',
      'justify-content-between',
      'align-items-start',
      'border-0',
      'border-end-0',
    );
    postElement.append(referenceElem);
    // const moreButton = createButton(i18Instance);
    // postElement.append(moreButton);
    list.append(postElement);
  });

  return list;
};

const render = (container, watchedState, i18Instance, property) => {
  container.innerHTML = '';
  const { card, cardHeader, cardBody } = createCard();
  const headerElement = document.createElement('h2');
  headerElement.classList.add('h3');
  headerElement.textContent = i18Instance.t(`contentHeader.${property}`);
  cardHeader.append(headerElement);

  const listMapping = {
    posts: (posts) => createPostsList(posts),
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

    const properties = Object.keys(watchedState.feedsData);

    const isValid = watchedState.status === 'valid';

    properties.forEach((prop) => {
      const container = document.querySelector(`.${prop}`);
      if (isValid) {
        render(container, watchedState, i18Instance, prop);
      }
    });
  });

  return watchedState;
};
