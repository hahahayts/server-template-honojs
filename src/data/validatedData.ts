import type { LoginType, RegisterType } from "../types/auth.js";
import { loginSchema, registerSchema } from "../zod/schema.js";

export function validatedRegisterData(payload: RegisterType) {
  const validatedData = registerSchema.safeParse({
    username: payload.username,
    email: payload.email,
    password: payload.password,
    confirmPassword: payload.confirmPassword,
  });

  return validatedData;
}
export function validatedLoginData(payload: LoginType) {
  const validatedData = loginSchema.safeParse({
    email: payload.email,
    password: payload.password,
  });

  return validatedData;
}
