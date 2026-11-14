import { z } from 'zod';

export const signupSchema = z
  .object({
    fullName: z.string().min(3, 'Full name must be at least 3 characters.'),
    email: z.string().email('Please enter a valid email.'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters.')
      .regex(/[A-Z]/, 'Password must include an uppercase letter.')
      .regex(/[a-z]/, 'Password must include a lowercase letter.')
      .regex(/[0-9]/, 'Password must include a number.'),
    confirmPassword: z.string().min(1, 'Please confirm your password.')
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword']
  });

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email.'),
  password: z.string().min(8, 'Password must be at least 8 characters.')
});

export const contactSchema = z.object({
  name: z.string().min(2, 'Name is required.'),
  email: z.string().email('Please enter a valid email.'),
  message: z.string().min(10, 'Message must be at least 10 characters.')
});

export const registrationSchema = z.object({
  fullName: z.string().min(3, 'Full name must be at least 3 characters.'),
  email: z.string().email('Please enter a valid email.'),
  mobileNumber: z.string().regex(/^[6-9]\d{9}$/, 'Use a valid 10-digit Indian mobile number.'),
  collegeName: z.string().min(2, 'Please select or enter your college.'),
  course: z.string().min(2, 'Course is required.'),
  branch: z.string().min(2, 'Branch is required.'),
  yearOfStudy: z.string().min(2, 'Year is required.'),
  domain: z.string().min(2, 'Domain is required.'),
  projectName: z.string().min(5, 'Project name must be at least 5 characters.'),
  pptLink: z.string().url('Please provide a valid Google Drive or OneDrive URL.'),
  prototypeLink: z.string().url('Please provide a valid GitHub, Figma, or demo URL.'),
  demoVideoLink: z.string().optional().or(z.literal('')).transform((val) => val || ''),
  teamSize: z.coerce.number().min(1).max(5),
  teamMembers: z.array(
    z.object({
      name: z.string().min(2, 'Member name is required.'),
      email: z.string().email('Please enter a valid member email.')
    })
  )
});
