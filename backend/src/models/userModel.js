import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function createUser(username, password) {
  return prisma.user.create({
    data: { username, password },
  });
}

export async function getUserByUsername(username) {
  return prisma.user.findUnique({
    where: { username },
    include: { tools: true },
  });
}

export async function getAllUsers() {
  return prisma.user.findMany({
    include: { tools: true },
  });
}
