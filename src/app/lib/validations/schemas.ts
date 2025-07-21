import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Must contain at least one number'),
  confirmPassword: z.string(),
  role: z.enum(['candidate', 'recruiter']),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export const jobApplicationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  resume: z.string().url('Must be a valid URL').or(z.string().min(20, 'Paste your resume text here')),
  coverLetter: z.string().optional(),
});

export const jobPostingSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(50, 'Description must be at least 50 characters'),
  company: z.string().min(2, 'Company name must be at least 2 characters'),
  location: z.string().min(2, 'Location must be specified'),
  salary: z.string().min(4, 'Salary range must be specified'),
  type: z.enum(['full-time', 'part-time', 'contract', 'internship']),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
export type JobPostingFormData = z.infer<typeof jobPostingSchema>;
export type JobApplicationFormData = z.infer<typeof jobApplicationSchema>;


