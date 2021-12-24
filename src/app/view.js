import onChange from 'on-change';

export default (state, i18nInstance) => {
  const input = document.querySelector('input');
  const formErrorContainer = document.querySelector('.invalid-feedback');
  const wathedState = onChange(state, (path, value) => {
    console.log(path, value)
    input.classList.remove('is-invalid');
    if (path === 'errors.formError' && value.length) {
      formErrorContainer.textContent = i18nInstance.t(value) || '';
      input.classList.add('is-invalid');
    }
  });

  return wathedState;
};
