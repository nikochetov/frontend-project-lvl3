import './styles/style.css';
import formSchema from './validators/rssUrlValidator';

const submitButton = document.querySelector('form');

submitButton.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const data = formData.get('rssInput');
  formSchema.validate({ name: data })
    .then((formValue) => console.log('data:::::', formValue))
    .catch((err) => {
      console.log('err.name:::::', err.name);
      console.log('err.errors:::::', err.errors);
    });
  console.log(formData.get('rssInput'));
});
