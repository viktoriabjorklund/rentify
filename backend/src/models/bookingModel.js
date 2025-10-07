import prisma from '../prismaClient.js';

export async function createBookingFromRequest(requestId) {
  const request = await prisma.request.findUnique({
    where: { id: requestId },
    include: { tool: true, renter: true }
  });

  if (!request) throw new Error("Request not found");
  if (!request.accepted) throw new Error("Request must be accepted before booking");

  return prisma.booking.create({
    data: {
      requestId: request.id,
      renterId: request.renterId,
      toolId: request.toolId,
      startDate: request.startDate,
      endDate: request.endDate,
      price: request.price ?? request.tool.price
    },
    include: {
      tool: true,
      renter: {
        select: {
          username: true,
          name: true,
          surname: true
        }
      },
    }
  });
}

export async function getAllBookingsByUser(userId) {
  return prisma.booking.findMany({
    where: {
      OR: [
        { renterId: userId },
        { tool: { userId: userId } }
      ]
    },
    select: {
      id: true,
      startDate: true,
      endDate: true,
      price: true,
      createdAt: true,
      tool: {
        select: {
          id: true,
          name: true,
          location: true,
          user: {
            select: {
              id: true,
              username: true,
              name: true,
              surname: true
            }
          }
        }
      },
      renter: {
        select: {
          id: true,
          username: true,
          name: true,
          surname: true
        }
      },
      request: {
        select: {
          id: true,
          startDate: true,
          endDate: true,
          accepted: true
        }
      }
    },
  });
}

