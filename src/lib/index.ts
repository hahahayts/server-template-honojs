import prisma from "../prisma_client/index.js";

export const getTaskById = async (id: number) => {
  const task = await prisma.task.findUnique({
    where: { id },
  });
  return task;
};
