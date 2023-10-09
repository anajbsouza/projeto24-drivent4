import { forbiddenError, notFoundError, unauthorizedError } from "@/errors";
import { cannotListHotelsError } from "@/errors/cannot-list-hotels-error";
import { enrollmentRepository, ticketsRepository } from "@/repositories";
import { bookingRepository } from "@/repositories/bookings-repository";
import { TicketStatus } from "@prisma/client";

async function validateUserBooking(userId: number) {
    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
    if (!enrollment) throw notFoundError();

    const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
    if (!ticket) throw notFoundError();

    const type = ticket.TicketType;

    if (ticket.status === TicketStatus.RESERVED || type.isRemote || !type.includesHotel) {
        throw cannotListHotelsError();
    }
}

async function getBooking(userId: number) {
    await validateUserBooking(userId);
    const booking = await bookingRepository.getBooking(userId);

    if(!booking) throw notFoundError();

    return {
        id: booking.id,
        Room: {
        ...booking.Room
        }
    };
}

async function haveBooking(userId: number, bookingId: number) {
    await validateUserBooking(userId);
    const booking = await bookingRepository.haveBooking(bookingId);
    if (!booking) throw unauthorizedError();
}

async function availableRoom(userId: number, roomId: number) {
    await validateUserBooking(userId);
    const room = await bookingRepository.availableRoom(roomId);
    if (!room) throw forbiddenError();
    if (room.Booking.length >= room.capacity) throw forbiddenError();
}

async function createBooking(userId: number, roomId: number) {
    await validateUserBooking(userId);
    const room = await bookingRepository.availableRoom(roomId);
    if (!room) throw notFoundError();
    if (room.Booking.length >= room.capacity) throw forbiddenError();
    
    const booking = await bookingRepository.createBooking(userId, roomId);
    const response = { bookingId: booking.id };
    return response;
}

async function updateBooking(userId: number, roomId: number, bookingId: number) {
    await haveBooking(userId, bookingId);
    const room = await bookingRepository.availableRoom(roomId);
    if (!room) throw notFoundError();
    if (room.Booking.length >= room.capacity) throw forbiddenError();
    
    const booking = await bookingRepository.updateBooking(bookingId, roomId);
    const response = { bookingId: booking.id };
    return response;
}


export const bookingService = {
    createBooking,
    getBooking,
    updateBooking,
}