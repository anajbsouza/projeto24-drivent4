import { prisma } from "@/config";

async function createBooking(userId: number, roomId: number) {
    return prisma.booking.create({
        data: { userId, roomId }
    });
}

async function getBooking(userId: number) {
    return prisma.booking.findFirst({
        where: { userId: userId },
        include: { Room: true }
    });
}

async function updateBooking(bookingId: number, roomId: number) {
    return prisma.booking.update({
        where: { id: bookingId },
        data: { roomId }
    });
}

// - A troca pode ser efetuada para usuários que possuem reservas.
// - A troca pode ser efetuada apenas para quartos livres.

async function haveBooking(id: number) {
    return await prisma.room.findUnique({
        where: { id },
        select: {
            capacity: true,
            _count: { select: { Booking: true } },
        },
    });
}

async function availableRoom(roomId: number) {
    return prisma.room.findFirst({
        where: { id: roomId },
        include: { Booking: true }
    });
}

export const bookingRepository = {
    createBooking,
    getBooking,
    updateBooking,
    haveBooking,
    availableRoom
}