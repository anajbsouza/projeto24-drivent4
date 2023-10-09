import { prisma } from '@/config';

async function getByUserId(userId: number) {
  return prisma.booking.findFirst({
    where: { userId: userId },
    include: {
      Room: true,
    },
  });
}

async function createBooking(userId: number, roomId: number) {
  return prisma.booking.create({
    data: {
      userId,
      roomId,
    },
  });
}

async function updateBooking(bookingId: number, roomId: number) {
  return prisma.booking.update({
    where: {
      id: bookingId,
    },
    data: {
      roomId,
    },
  });
}

async function getRoomInfo(id: number) {
  return await prisma.room.findUnique({
    where: { id },
    select: {
      capacity: true,
      _count: { select: { Booking: true } },
    },
  });
}

async function roomIdExists(roomId: number) {
  return prisma.room.findFirst({
    where: {
      id: roomId,
    },
    include: {
      Booking: true,
    },
  });
}

export const bookingRepository = {
  getByUserId,
  createBooking,
  updateBooking,
  roomIdExists,
  getRoomInfo,
};
