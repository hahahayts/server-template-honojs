import type { Context } from "hono";
import prisma from "../../prisma_client/index.js";
import { getTaskById } from "../../lib/index.js";

const product = await prisma.product;

export async function getProductsController(c: Context) {
  const products = await product.findMany();
  console.log(c);
  return c.json(products);
}

export async function getProductByIdController(c: Context) {
  const id = parseInt(c.req.param("id"));
  console.log(id);
  const productData = await product.findUnique({
    where: { id },
  });
  if (!productData) return c.json({ message: "Not found" }, 404);
  return c.json(productData);
}

export async function createProductController(c: Context) {
  const data = await c.req.json();
  const newProduct = {
    title: data.title,
    completed: false,
  };
  const createProduct = await product.create({
    data: newProduct,
  });
  return c.json(createProduct, 201);
}

export async function replaceProductController(c: Context) {
  const id = parseInt(c.req.param("id"));
  const data = await c.req.json();

  const productData = await getTaskById(id);

  if (!productData) return c.json({ message: "Not found" }, 404);
  const updatedProduct = await product.update({
    where: { id },
    data: {
      title: data.title,
      completed: data.completed,
    },
  });

  return c.json(updatedProduct, 200);
}

export async function deleteProductController(c: Context) {
  const id = parseInt(c.req.param("id"));
  const todo = await getTaskById(id);

  if (!todo) return c.json({ message: "Not found" }, 404);

  await product.delete({
    where: { id },
  });

  return c.json({ message: "Deleted successfully" });
}
