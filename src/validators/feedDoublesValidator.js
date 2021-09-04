import * as yup from 'yup';

export default (data) => {
  console.log('-----------', data);
  return yup.mixed().notOneOf(data, 'feed is already exist');
}
