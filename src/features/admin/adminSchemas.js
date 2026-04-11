/* ===== YUP VALIDATION SCHEMAS ===== */
/* Form validation schemas for admin operations */

import * as yup from 'yup'

export const adminCreateSchema = yup.object({
  name: yup.string().required('Name is required').min(2, 'Name must be at least 2 characters'),
  email: yup.string().required('Email is required').email('Please enter a valid email address'),
  password: yup.string().required('Password is required').min(6, 'Password must be at least 6 characters'),
})
