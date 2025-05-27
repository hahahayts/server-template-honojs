import { Hono } from "hono";
import prisma from "./prisma_client/index.js";
import { getTaskById } from "./lib/index.js";

const route = new Hono();
const task = await prisma.task;

// GET /todos - list all todos
route.get("/todos", async (c) => {
  const todos = await task.findMany();
  console.log(c);
  return c.json(todos);
});

// GET /todos/:id - get a single todo by id
route.get("/todos/:id", async (c) => {
  const id = parseInt(c.req.param("id"));
  console.log(id);
  const todo = await task.findUnique({
    where: { id },
  });
  if (!todo) return c.json({ message: "Not found" }, 404);
  return c.json(todo);
});

// POST /todos - create a new todo
route.post("/todos", async (c) => {
  const data = await c.req.json();
  const newTodo = {
    title: data.title,
    completed: false,
  };
  const createdTodo = await task.create({
    data: newTodo,
  });
  return c.json(createdTodo, 201);
});

// PUT /todos/:id - replace a todo (full update)
route.put("/todos/:id", async (c) => {
  const id = parseInt(c.req.param("id"));
  const data = await c.req.json();

  const todo = await getTaskById(id);

  if (!todo) return c.json({ message: "Not found" }, 404);
  const updatedTodo = await task.update({
    where: { id },
    data: {
      title: data.title,
      completed: data.completed,
    },
  });

  return c.json(updatedTodo);
});

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
route.delete("/todos/:id", async (c) => {
  const id = parseInt(c.req.param("id"));
  const todo = await getTaskById(id);

  if (!todo) return c.json({ message: "Not found" }, 404);

  await task.delete({
    where: { id },
  });

  return c.json({ message: "Deleted successfully" });
});

export default route;
