import './styles/style.css';
import axios from 'axios';
import formSchema from './validators/rssUrlValidator';
// import parser from './app/parser';
import initView from './app/view'

const submitButton = document.querySelector('form');

const state = {
  feeds: [],
}

const watchedState = initView(state);

const requestData = (address) => {
  axios.get(address).then((request) => console.log(request.data))
};

submitButton.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const data = formData.get('rssInput');
  requestData(data);

  formSchema.validate({ name: data })
    .then((formValue) => console.log('data:::::', formValue))
    .catch((err) => {
      console.log('err.name:::::', err.name);
      console.log('err.errors:::::', err.errors);
    });
  console.log(formData.get('rssInput'));
});
