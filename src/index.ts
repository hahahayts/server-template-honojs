import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import auth from "./controllers/auth/routes.js";
import authMiddleware from "./middlewares/auth/index.js";
import { routes } from "./controllers/routes.js";

const app = new Hono();

app.use(
  "*",
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173"],
    credentials: true,
  })
);

// ✅ Apply JWT middleware before routing /api
app.use("/api/*", authMiddleware);

// Auth routes (register/login)
app.route("/auth", auth);

// Protected API routes
routes.forEach((route) => {
  app.route("/api", route);
});

serve(
  {
    fetch: app.fetch,
    port: 8080,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);
