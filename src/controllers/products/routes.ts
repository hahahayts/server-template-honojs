import { Hono } from "hono";
import {
  createProductController,
  deleteProductController,
  getProductByIdController,
  getProductsController,
  replaceProductController,
} from "./index.js";
const route = new Hono().get("/products", getProductsController);

route
  .get("/product/:id", getProductByIdController)
  .post("/product", createProductController)
  .put("/product/:id", replaceProductController)
  .delete("/product/:id", deleteProductController);

// PATCH /todos/:id - update part of a todo
// route.patch("/todos/:id", async (c) => {
//   const id = parseInt(c.req.param("id"));
//   const todo = todos.find((t) => t.id === id);
//   if (!todo) return c.json({ message: "Not found" }, 404);

//   const data = await c.req.json();
//   Object.assign(todo, data);
//   return c.json(todo);
// });

// DELETE /todos/:id - delete a todo

export default route;
