import { z } from 'zod';

export const signupSchema = z.object({
  fullName: z.string().trim().min(3).max(120),
  email: z.string().trim().email(),
  password: z
    .string()
    .min(8)
    .regex(/[A-Z]/, 'Password must include at least one uppercase character.')
    .regex(/[a-z]/, 'Password must include at least one lowercase character.')
    .regex(/[0-9]/, 'Password must include at least one number.')
});

export const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(8)
});

export const otpSchema = z.object({
  email: z.string().trim().email(),
  otp: z.string().regex(/^\d{6}$/)
});

export const registrationSchema = z.object({
  fullName: z.string().trim().min(3),
  email: z.string().trim().email(),
  mobileNumber: z.string().trim().regex(/^[6-9]\d{9}$/),
  collegeName: z.string().trim().min(2),
  course: z.string().trim().min(2),
  branch: z.string().trim().min(2),
  yearOfStudy: z.string().trim().min(2),
  domain: z.string().trim().min(2),
  projectName: z.string().trim().min(5),
  pptLink: z.string().trim().url(),
  prototypeLink: z.string().trim().url(),
  demoVideoLink: z.string().trim().url().optional().or(z.literal('')),
  teamSize: z.number().int().min(1).max(5),
  teamMembers: z.array(
    z.object({
      name: z.string().trim().min(2),
      email: z.string().trim().email()
    })
  )
});

export const contactSchema = z.object({
  name: z.string().trim().min(2),
  email: z.string().trim().email(),
  message: z.string().trim().min(10).max(1500)
});
