import * as yup from 'yup';

const isRss = (status) => status.content_type.includes('application/rss+xml');

yup.addMethod(yup.mixed, 'feed', function method(options) {
  const { message } = options;
  return this.test({
    name: 'feed',
    message,
    test: (response) => isRss(response.data.status),
  });
});

export default () => yup.mixed().feed({ message: 'errors.formErrors.not_contain_rss' });
