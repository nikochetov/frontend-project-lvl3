import onChange from 'on-change';

const createButton = () => {
  const button = document.createElement('button');
  button.setAttribute('type', 'button');
  button.classList.add('btn', 'btn-primary');
  button.textContent = 'Просмотр';
  return button;
}

const createList = (value) => {
  const list = document.createElement('ul');
  value.forEach((post) => {
    const postElement = document.createElement('li');
    const referenceElem = document.createElement('a');
    referenceElem.setAttribute('href', post.link);
    referenceElem.textContent = post.title;
    postElement.classList.add('list-group-item');
    postElement.append(referenceElem);
    const moreButton = createButton();
    postElement.append(moreButton);
    list.append(postElement);
  });

  return list;
};
  
export default (state, i18nInstance) => {
  const input = document.querySelector('input');
  const formErrorContainer = document.querySelector('.invalid-feedback');
  const wathedState = onChange(state, (path, value) => {
    console.log(path, value);
    input.classList.remove('is-invalid');
    if (path === 'errors.formError' && value.length) {
      formErrorContainer.textContent = i18nInstance.t(value) || '';
      input.classList.add('is-invalid');
    }

    if (path === 'feedsData.posts' && value.length) {
      const postsContainer = document.querySelector('.posts');
      postsContainer.innerHTML = '';
      const list = document.createElement('ul');
      value.forEach((post) => {
        const postElement = document.createElement('li');
        const referenceElem = document.createElement('a');
        referenceElem.setAttribute('href', post.link);
        referenceElem.textContent = post.title;
        postElement.classList.add(
          'list-group-item',
          'd-flex',
          'justify-content-between',
          'align-items-start',
          'border-end-0',
        );
        postElement.append(referenceElem);
        const moreButton = createButton();
        postElement.append(moreButton);
        list.append(postElement);
      });

      postsContainer.append(list);
    }

    if (path === 'feedsData.feeds' && value.length) {
      const feedsContainer = document.querySelector('.feeds');
      feedsContainer.innerHTML = '';
      const list = document.createElement('ul');
      value.forEach((post) => {
        const feedElement = document.createElement('li');
        const header = document.createElement('h3');
        const description = document.createElement('p');
        description.classList.add('m-0', 'small', 'text-black-50');
        header.classList.add('h6', 'm-0');
        header.textContent = post.title;
        description.textContent = post.description;
        feedElement.classList.add('list-group-item');
        list.append(header);
        list.append(description);
      });

      feedsContainer.append(list);
    }
  });

  return wathedState;
};
