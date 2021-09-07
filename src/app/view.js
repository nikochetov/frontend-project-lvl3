import onChange from 'on-change';

export default (state) => {
  const input = document.querySelector('input');
  const formErrorContainer = document.querySelector('.invalid-feedback');
  const wathedState = onChange(state, (path, value) => {
    input.classList.remove('is-invalid');
    if (path === 'errors.formErrors' && value.length) {
      console.log(value)
      const [error] = value;
      formErrorContainer.textContent = error || '';
      input.classList.add('is-invalid');
    }
  });

  return wathedState;
}
