import * as yup from 'yup';

const formSchema = yup.object().shape({
  name: yup.string().url('Введен некорректный URL').required('Обязательное поле'),
});

export default formSchema;
