import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
import { createBookingFromRequest } from "./bookingModel.js";

export async function getAllSentRequests(userId) {
  return prisma.request.findMany({
    where: { renterId: userId },
    include: {
      tool: {
        select: {
          id: true,
          name: true,
          location: true,
          price: true,
          user: {
            select: {
              id: true,
              username: true,
              name: true,
              surname: true,
            },
          },
        },
      },
    },
  });
}

export async function getAllRecievedRequests(userId) {
  return prisma.request.findMany({
    where: { tool: { userId: userId } },
    select: {
      id: true,
      startDate: true,
      endDate: true,
      pending: true,
      accepted: true,
      price: true,
      viewed: true,
      tool: {
        select: {
          id: true,
          name: true,
          description: true,
          location: true,
          price: true,
        },
      },
      renter: {
        select: {
          id: true,
          username: true,
          name: true,
          surname: true,
        },
      },
    },
  });
}

export async function createRequest({
  renterId,
  toolId,
  startDate,
  endDate,
  price,
}) {
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
        select: { id: true, name: true, price: true, location: true },
      },
      startDate: true,
      endDate: true,
      pending: true,
      accepted: true,
      price: true,
      viewed: true,
    },
  });
}

export async function getRequestById(id) {
  return prisma.request.findUnique({
    where: { id },
    select: {
      id: true,
      startDate: true,
      endDate: true,
      pending: true,
      accepted: true,
      price: true,
      renter: {
        select: {
          username: true,
          name: true,
          surname: true,
        },
      },
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
              surname: true,
            },
          },
        },
      },
    },
  });
}

export async function deleteRequest(id) {
  return prisma.request.delete({
    where: { id: parseInt(id) },
  });
}

export async function updateRequest(id, data) {
  const updatePayload = {
    where: { id: parseInt(id) },
    data: {
      pending: data.pending,
      accepted: data.accepted,
      price: data.price,
      // When a response is given (pending -> false), mark as unviewed again
      ...(data.pending === false ? { viewed: false } : {}),
    },
  };

  const updated = await prisma.request.update(updatePayload);

  if (updated.accepted && !updated.pending) {
    const existingBooking = await prisma.booking.findUnique({
      where: { requestId: updated.id },
    });

    if (!existingBooking) {
      await createBookingFromRequest(updated.id);
    }
  }

  return updated;
}

export async function updateRequestViewStatus(id, viewed) {
  return prisma.request.update({
    where: { id: parseInt(id) },
    data: { viewed },
    select: {
      id: true,
      viewed: true,
    },
  });
}
