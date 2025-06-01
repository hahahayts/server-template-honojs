import type { Context } from "hono";
import type { Product } from "../generated/prisma/index.js";
import prisma from "../prisma_client/index.js";
import type { ProductPayloadType } from "../types/product.js";

const product = await prisma.product;

export async function getProductsData() {
  const products = await product.findMany();

  return products;
}

export async function getProductByIdData(id: string) {
  const productData = await product.findUnique({
    where: { id },
  });

  return productData;
}

export async function createProductData(payload: ProductPayloadType) {
  const createProduct = await product.create({
    data: payload,
  });

  return createProduct;
}

export async function replaceProductData(
  id: string,
  payload: ProductPayloadType,
  c: Context
) {
  const productData = getProductByIdData(id);

  if (!productData) return c.json({ message: "Not found" }, 404);
  const updatedProduct = await product.update({
    where: { id },
    data: payload,
  });

  return updatedProduct;
}

export async function deleteProductData(id: string, c: Context) {
  const product = await getProductByIdData(id);
  if (!product) return c.json({ message: "Not found" }, 404);

  const deletedProduct = await product.delete({
    where: { id },
  });

  return deletedProduct;
}
