import './styles/style.css';
import axios from 'axios';
import formSchema from './validators/rssUrlValidator';
import feedDoublesValidator from './validators/feedDoublesValidator';
// import parser from './app/parser';
import initView from './app/view';

const submitButton = document.querySelector('form');

const state = {
  status: 'invalid',
  feedsName: [],
  errors: {
    formErrors: [],
    requestErrors: [],
  },
}

const watchedState = initView(state);

const requestData = (address) => {
  axios.get(address)
    .then((response) => console.log(response.data))
    .catch((err) => console.log(err.response));
};

submitButton.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const data = formData.get('rssInput');
  Promise.all([
    formSchema.validate({ name: data }), feedDoublesValidator(state.feedsName).validate(data),
  ])
    .then(([formValue]) => {
      watchedState.feedsName.push(formValue.name);
      requestData(formValue.name);
    })
    .catch((err) => {
      watchedState.errors.formErrors = err.errors;
      console.log(err.errors);
    });
});
