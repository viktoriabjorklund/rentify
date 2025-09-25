import prisma from '../prismaClient.js';



export async function getAllSentRequests(userId) {
    return prisma.request.findMany({
        where: { renterId: userId },
        include: { tool: true, owner: true }
    });
}

export async function getAllRecievedRequests(userId) {
    return prisma.request.findMany({
        where: { userId: userId },
        include: { tool: true, renter: true }
    });
}

export async function createRequest({ renterId, toolId, startDate, endDate, price }) {
    const tool = await prisma.tool.findUnique({
      where: { id: toolId },
      select: { userId: true, price: true },
    });
  
    if (!tool) {
      throw new Error("Tool not found");
    }
  
    return prisma.request.create({
        data: {
          renterId,
          toolId,
          startDate,
          endDate,
          price: price ?? tool.price,
        },
        select: {
          id: true,
          renterId: true,
          tool: {
            select: { id: true, name: true, price: true, location: true }
          },
          startDate: true,
          endDate: true,
          pending: true,
          accepted: true,
          price: true
        }
      })
      
  }