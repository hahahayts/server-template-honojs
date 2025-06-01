import TodosRoutes from "./products/routes.js";

export const routes = [TodosRoutes] as const;

export type AppRoutes = (typeof routes)[number];
