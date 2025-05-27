import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { basicAuth } from "hono/basic-auth";
import route from "./routes.js";
import { cors } from "hono/cors";
import auth from "./auth/route.js";

const app = new Hono();

app.use(
  "*",
  cors({ origin: ["http://localhost:3000", "http://localhost:5173"] })
);

app.route("/api", route);
app.route("/auth", auth);

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
