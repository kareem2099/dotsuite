import { z } from "zod";

// Display names end up inside emails sent from our domain, so keep them short and
// free of markup or links that could be used to phish whoever receives them.
export const NAME_MAX_LENGTH = 50;
export const nameSchema = z
  .string()
  .trim()
  .min(2, "Name must be at least 2 characters")
  .max(NAME_MAX_LENGTH, `Name must be at most ${NAME_MAX_LENGTH} characters`)
  .refine((v) => !/[<>]|:\/\/|www\./i.test(v), "Name can't contain links or < > characters");

// Zod Validation Schema
export const registerSchema = z.object({
  name: nameSchema,
  email: z.string().email("Please enter a valid email address"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least 1 uppercase letter")
    .regex(/[a-z]/, "Password must contain at least 1 lowercase letter")
    .regex(/[0-9]/, "Password must contain at least 1 number")
    .regex(/[!@#$%^&*]/, "Password must contain at least 1 special character (!@#$%^&*)"),
  confirmPassword: z.string(),
  terms: z.boolean().refine((val) => val === true, {
    message: "termsRequired",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

// Type for the form data (Magic ✨)
export type RegisterFormData = z.infer<typeof registerSchema>;

// ==========================================
// Legacy Validation (For Backend/Backward Compatibility)
// ==========================================

// Email regex 
export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Password regex 
export const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;

// Validation functions
export function validateEmail(email: string): { isValid: boolean; error?: string } {
  if (!email) {
    return { isValid: false, error: "Email is required" };
  }
  
  if (!emailRegex.test(email)) {
    return { isValid: false, error: "Please enter a valid email address" };
  }
  
  return { isValid: true };
}

export function validatePassword(password: string): { 
  isValid: boolean; 
  error?: string;
  requirements?: string[];
} {
  const errors: string[] = [];
  
  if (!password) {
    return { isValid: false, error: "Password is required" };
  }
  
  if (password.length < 8) {
    errors.push("At least 8 characters");
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("At least 1 uppercase letter");
  }
  if (!/[a-z]/.test(password)) {
    errors.push("At least 1 lowercase letter");
  }
  if (!/\d/.test(password)) {
    errors.push("At least 1 number");
  }
  if (!/[!@#$%^&*]/.test(password)) {
    errors.push("At least 1 special character (!@#$%^&*)");
  }
  
  if (errors.length > 0) {
    return { 
      isValid: false, 
      error: "Password does not meet requirements",
      requirements: errors 
    };
  }
  
  return { isValid: true };
}

export function validateName(name: string): { isValid: boolean; error?: string } {
  if (!name) {
    return { isValid: false, error: "Name is required" };
  }
  
  if (name.length < 2) {
    return { isValid: false, error: "Name must be at least 2 characters" };
  }
  
  return { isValid: true };
}