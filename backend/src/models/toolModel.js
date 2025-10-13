import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getAllTools() {
  return prisma.tool.findMany({
    include: { user: true },
  });
}

export async function createTool({name, description, price, location, userId}) {
  return prisma.tool.create({
    data: {
      name,
      description,
      price,
      location,
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


export async function displayTool(id) {
  return prisma.tool.findUnique({
    where: { id: parseInt(id)},
    include: { user: true }, // la till för att frontend ska få användardata 
  });
}

export async function getToolsByUser(userId) {
  return prisma.tool.findMany({
    where: { userId: parseInt(userId) },
    include: { select: user.name, 
      select: user.username, 
      select:user.id,
      select: user.surname}, // la till för att frontend ska få användardata 
  });
}
