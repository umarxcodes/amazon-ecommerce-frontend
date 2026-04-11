/* ===== YUP VALIDATION SCHEMAS ===== */
/* Form validation schemas for order/checkout forms */

import * as yup from 'yup'

export const checkoutSchema = yup.object({
  fullName: yup.string().required('Full name is required').min(2, 'Name must be at least 2 characters'),
  addressLine1: yup.string().required('Address is required').min(3, 'Address must be at least 3 characters'),
  city: yup.string().required('City is required').min(2, 'City must be at least 2 characters'),
  state: yup.string().optional(),
  postalCode: yup.string().required('ZIP / Postal code is required').min(3, 'Valid postal code is required'),
  country: yup.string().required('Country is required').min(2, 'Valid country is required'),
})
