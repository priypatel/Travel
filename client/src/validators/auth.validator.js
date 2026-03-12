import * as yup from 'yup';

export const loginSchema = yup.object({
  email: yup
    .string()
    .trim()
    .email('Invalid email address')
    .required('Email is required'),
  password: yup
    .string()
    .required('Password is required'),
});

export const registerSchema = yup.object({
  name: yup
    .string()
    .trim()
    .required('Name is required'),
  email: yup
    .string()
    .trim()
    .email('Invalid email address')
    .required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirm: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords do not match')
    .required('Please confirm your password'),
});
