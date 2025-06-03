import { Hono } from "hono";

import {
  getCurrentUserController,
  loginController,
  logoutController,
  registerController,
} from "./index.js";

const auth = new Hono()
  .post("/register", registerController)
  .post("/login", loginController)
  .post("/logout", logoutController)
  .get("/me", getCurrentUserController);

export default auth;
