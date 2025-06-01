import type { Context } from "hono";
import {
  createProductData,
  deleteProductData,
  getProductByIdData,
  getProductsData,
  replaceProductData,
} from "../../data/product.js";

export function getProductsController(c: Context) {
  const products = getProductsData();
  console.log(c);
  return c.json(products);
}

export function getProductByIdController(c: Context) {
  const id = c.req.param("id");
  console.log(id);
  const productData = getProductByIdData(id);
  if (!productData) return c.json({ message: "Not found" }, 404);
  return c.json(productData, 200);
}

export async function createProductController(c: Context) {
  const data = await c.req.json();
  const newProduct = {
    name: data.name,
    price: data.price,
  };
  const createProduct = createProductData(newProduct);
  return c.json(createProduct, 201);
}

export async function replaceProductController(c: Context) {
  const id = c.req.param("id");
  const data = await c.req.json();

  const payload = {
    name: data.name,
    description: data.description,
    price: data.price,
  };

  const updatedProduct = replaceProductData(id, payload, c);

  return c.json(updatedProduct, 200);
}

export async function deleteProductController(c: Context) {
  const id = c.req.param("id");

  const deletedProduct = deleteProductData(id, c);

  return c.json(deletedProduct, 200);
}
