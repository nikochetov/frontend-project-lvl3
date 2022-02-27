import * as yup from 'yup';
import { isRss } from '../app/parser.js';

yup.addMethod(yup.mixed, 'feed', function method(options) {
  const { message } = options;
  return this.test({
    name: 'feed',
    message,
    test: (response) => isRss(response.data.contents),
  });
});

export default () => yup.mixed().feed({ message: 'errors.formErrors.not_contain_rss' });
