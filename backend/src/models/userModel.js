import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function createUser(username, password, name = null, surname = null) {
  return prisma.user.create({
    data: { username, password, name, surname },
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

export async function updateUser(id, name, surname, password) {
  return prisma.user.update({
    where: { id: parseInt(id) },
    data: { name, surname, password },
  });
}

export async function deleteUser(id) {
  return prisma.user.delete({
    where: { id: parseInt(id) },
  });
}


export async function displayUser(id) {
  return prisma.user.findUnique({
    where: { id: parseInt(id)},
  });
}
