import prisma from '../prismaClient.js';

export async function getAllTools() {
  return prisma.tool.findMany({
    include: { user: true },
  });
}

export async function createTool(name, userId) {
  return prisma.tool.create({
    data: {
      name,
      description: "",
      userId,
    },
    include: { user: true },
  });
}

export async function updateTool(id, description) {
  return prisma.tool.update({
    where: { id: parseInt(id) },
    data: { description },
    include: { user: true },
  });
}

export async function deleteTool(id) {
  return prisma.tool.delete({
    where: { id: parseInt(id) },
  });
}
