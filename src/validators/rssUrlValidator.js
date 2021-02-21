import * as yup from 'yup';

const formSchema = yup.object().shape({
  name: yup.string().url().required(),
});

export default formSchema;
