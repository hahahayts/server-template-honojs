import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { basicAuth } from "hono/basic-auth";
import route from "./routes.js";
import { cors } from "hono/cors";
import auth from "./auth/route.js";
import authMiddleware from "../middleware.js";

const app = new Hono();

app.use(
  "*",
  cors({ origin: ["http://localhost:3000", "http://localhost:5173"] })
);

// ✅ Apply JWT middleware before routing /api
app.use("/api/*", authMiddleware);

// Auth routes (register/login)
app.route("/auth", auth);

// Protected API routes
app.route("/api", route);

app.get(
  "/login",
  basicAuth({
    username: "user",
    password: "user111",
  }),
  (c) => {
    return c.text("Welcome to the protected route!");
  }
);

serve(
  {
    fetch: app.fetch,
    port: 8080,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);
