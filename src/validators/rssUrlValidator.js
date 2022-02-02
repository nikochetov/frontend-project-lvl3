import * as yup from 'yup';

export default () => yup.object().shape({
  rssInputValue: yup.string().url().required(),
});
