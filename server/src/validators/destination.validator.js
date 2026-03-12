import * as yup from 'yup';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

// Validates optional ?month= query param on GET /destinations
export const destinationQuerySchema = yup.object({
  month: yup
    .string()
    .trim()
    .test(
      'valid-month',
      'month must be a full month name (e.g. June)',
      (val) => !val || MONTHS.some((m) => m.toLowerCase() === val.toLowerCase())
    )
    .optional(),
});
