import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getAllTools() {
  return prisma.tool.findMany({
    orderBy: { id: "desc" },
    include: { user: true },
  });
}

function toNumberOrNull(v) {
  if (v == null) return null;                
  const s = String(v).trim();
  if (s === "") return null;                  
  const n = Number(s.replace(",", "."));      
  return Number.isFinite(n) ? n : null;
}


export async function createTool({ name, description, price, location, photoURL, userId }) {
  return prisma.tool.create({
    data: {
      name,
      description: description ?? "",
      price: toNumberOrNull(price),           
      location: location ?? "",
      photoURL: photoURL ?? "",
      userId: Number(userId),
    },
    include: { user: true },
  });
}

export async function updateTool(id, arg) {
  const toolId = Number(id);
  if (!Number.isFinite(toolId)) throw new Error("Invalid id");

  const patch = (typeof arg === "string") ? { description: arg } : (arg || {});

  // Build Prisma data from allowed keys only (avoid mass-assignment)
  const data = {};
  if (patch.name !== undefined) data.name = patch.name;
  if (patch.description !== undefined) data.description = patch.description;
  if (patch.location !== undefined) data.location = patch.location;
  if (patch.photoURL !== undefined) data.photoURL = patch.photoURL;
  if (patch.price !== undefined) data.price = toNumberOrNull(patch.price);

  // Optional: early no-op guard
  if (Object.keys(data).length === 0) {
    return prisma.tool.findUnique({ where: { id: toolId }, include: { user: true } });
  }

  return prisma.tool.update({
    where: { id: toolId },
    data,
    include: { user: true },
  });
}

export async function deleteTool(id) {
  return prisma.tool.delete({
    where: { id: Number(id) },
  });
}


export async function displayTool(id) {
  return prisma.tool.findUnique({
    where: { id: Number(id) },
    include: { user: true },
  });
}

export async function getToolsByUser(userId) {
  return prisma.tool.findMany({
    where: { userId: Number(userId) },
    orderBy: { id: "desc" },
    include: { user: true },
  });
}
