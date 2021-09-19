import * as yup from 'yup';

export default (data) => {
  return yup.mixed().notOneOf(data);
}
