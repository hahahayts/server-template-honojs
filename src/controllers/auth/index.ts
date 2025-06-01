import bcrypt from "bcryptjs";
import prisma from "../../prisma_client/index.js";
import { loginSchema } from "../../zod/schema.js";
import { verify } from "hono/jwt";
import { getCookie, setCookie } from "hono/cookie";
import type { Context } from "hono";
import { setJWTData } from "../../data/cookie.js";
import {
  validatedLoginData,
  validatedRegisterData,
} from "../../data/validatedData.js";

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function registerController(c: Context) {
  const { username, email, password, confirmPassword } = await c.req.json();

  const validatedData = validatedRegisterData({
    username,
    email,
    password,
    confirmPassword,
  });

  if (validatedData.success) {
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.data.email },
    });
    if (existingUser) return c.json({ error: "Email already used" }, 400);

    const hashedPassword = await bcrypt.hash(validatedData.data.password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    const payload = {
      id: user.id,
      email: user.email,
      username: user.username,
    };

    // Sign the JWT token
    const token = setJWTData(payload, c);

    return c.json({
      message: "Registered successfully",
      user: {
        id: user.id,
        email: user.email,
      },
    });
  }

  return c.json({
    message: "Validation failed",
    errors: validatedData.error.errors,
  });
}

export async function loginController(c: Context) {
  const { email, password } = await c.req.json();

  const validatedData = validatedLoginData({ email, password });
  // Validate the login data
  if (!validatedData.success) {
    return c.json({
      message: "Validation failed",
      errors: validatedData.error.errors,
    });
  }

  const user = await prisma.user.findUnique({
    where: { email: validatedData.data.email },
  });
  if (!user) return c.json({ error: "Invalid credentials" }, 401);

  const valid = await bcrypt.compare(
    validatedData.data.password,
    user.password
  );
  if (!valid) return c.json({ error: "Invalid credentials" }, 401);

  const payload = {
    id: user.id,
    email: user.email,
    username: user.username,
  };

  // Sign the JWT token
  const token = setJWTData(payload, c);

  return c.json({
    message: "Login successful",
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
    },
  });
}

export async function logoutController(c: Context) {
  setCookie(c, "token", "", {
    httpOnly: true,
    secure: true,
    maxAge: 0,
    path: "/",
  });
  return c.json({ message: "Logged out" });
}

export async function getCurrentUserController(c: Context) {
  const token = getCookie(c, "token");
  if (!token) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  try {
    const payload = await verify(token, JWT_SECRET, "HS256");
    return c.json({ user: payload }, 200);
  } catch (error) {
    return c.json({ error: "Unauthorized" }, 401);
  }
}
