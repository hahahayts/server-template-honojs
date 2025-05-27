import { Hono } from "hono";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../prisma_client/index.js";
import { loginSchema, registerSchema } from "../zod/schema.js";

const auth = new Hono();
const JWT_SECRET = "your_jwt_secret";

// Register
auth.post("/register", async (c) => {
  const { username, email, password, confirmPassword } = await c.req.json();

  const validatedData = registerSchema.safeParse({
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

    return c.json({
      message: "Registered successfully",
      user: { id: user.id, email: user.email },
    });
  }

  return c.json({
    message: "Validation failed",
    errors: validatedData.error.errors,
  });
});

// Login
auth.post("/login", async (c) => {
  const { email, password } = await c.req.json();

  const validatedData = loginSchema.safeParse({ email, password });
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

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "1h" });

  return c.json({ token });
});

export default auth;
