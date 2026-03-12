import * as yup from 'yup';

export const aiRecommendSchema = yup.object({
  location: yup
    .string()
    .trim()
    .default('anywhere'),
  budget: yup
    .string()
    .oneOf(['Low', 'Medium', 'High'], 'Budget must be Low, Medium, or High')
    .required('Budget is required'),
  days: yup
    .number()
    .typeError('Days must be a number')
    .min(1, 'Must be at least 1 day')
    .required('Travel length is required'),
  travelStyle: yup
    .string()
    .trim()
    .required('Travel style is required'),
  interests: yup
    .array()
    .of(yup.string().trim())
    .min(1, 'Select at least one interest')
    .required('Interests are required'),
});
