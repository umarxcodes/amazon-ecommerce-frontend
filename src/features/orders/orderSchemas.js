/* ===== YUP VALIDATION SCHEMAS ===== */
/* Form validation schemas for order/checkout forms */

import * as yup from 'yup'

export const checkoutSchema = yup.object({
  fullName: yup.string().optional(),
  address: yup
    .string()
    .required('Address is required')
    .min(3, 'Address must be at least 3 characters'),
  city: yup
    .string()
    .required('City is required')
    .min(2, 'City must be at least 2 characters'),
  postalCode: yup
    .string()
    .required('Postal code is required')
    .min(2, 'Valid postal code is required'),
  country: yup
    .string()
    .required('Country is required')
    .min(2, 'Valid country is required'),
})
