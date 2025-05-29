//middleware.ts
// This file contains middleware for a Hono application to handle JWT authentication.

import { type MiddlewareHandler } from "hono";
import { getCookie } from "hono/cookie";
import { verify } from "hono/jwt";

const JWT_SECRET = "this_is_a_secret_key_for_jwt";

// const authMiddleware: MiddlewareHandler = async (c, next) => {
//   console.log(c.req.header("authorization"));
//   const auth = c.req.header("Authorization");
//   console.log("Header: ", auth);

//   if (!auth || !auth.startsWith("Bearer ")) {
//     return c.json({ error: "Unauthorized" }, 401);
//   }

//   const token = auth.split(" ")[1];
//   console.log("Token", token);

//   // Here you would verify the token, e.g., using a JWT library

//   try {
//     const payload = await verify(token, JWT_SECRET, "HS256");
//     c.set("user", payload);
//     await next();
//   } catch (error) {
//     return c.json({ error: "Invalid token" }, 401);
//   }
// };

const authMiddleware: MiddlewareHandler = async (c, next) => {
  const token = getCookie(c, "token");
  if (!token) {
    return c.json({ error: "Unauthorized" }, 401);
  }
  try {
    const payload = await verify(token, JWT_SECRET, "HS256");
    c.set("user", payload);
    await next();
  } catch (error) {
    return c.json({ error: "Invalid token" }, 401);
  }
};

export default authMiddleware;
