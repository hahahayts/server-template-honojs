import { sign } from "hono/jwt";
import type { Context } from "hono";
import { setCookie } from "hono/cookie";
import type { MyJwtPayload } from "../types/cookie.js";

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function setJWTData(payload: MyJwtPayload, c: Context) {
  const token = await sign(payload, JWT_SECRET, "HS256");
  console.log("Generated token:", token); // Check if token is created

  setCookie(c, "token", token, {
    httpOnly: true, // Set to true if you want to prevent client-side access
    secure: false, // Set to true if using HTTPS
    maxAge: 60 * 60,
    path: "/",
    sameSite: "Lax",
  });

  return token;
}
