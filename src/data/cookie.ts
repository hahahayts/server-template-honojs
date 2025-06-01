import { sign } from "hono/jwt";
import type { Context } from "hono";
import { setCookie } from "hono/cookie";
import type { JwtPayload } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function setJWTData(payload: JwtPayload, c: Context) {
  const token = await sign(payload, JWT_SECRET, "HS256");

  setCookie(c, "token", token, {
    httpOnly: true,
    secure: true,
    maxAge: 60 * 60,
    path: "/",
    sameSite: "Lax",
  });

  return token;
}
