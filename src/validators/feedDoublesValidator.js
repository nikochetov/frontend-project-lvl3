import * as yup from 'yup';

export default (data) => yup.mixed().notOneOf(data);
