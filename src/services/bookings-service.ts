import { notFoundError } from '@/errors';

import { forbiddenError } from '@/errors/forbidden-error';
import { ticketsRepository } from '@/repositories/tickets-repository';
import { enrollmentRepository } from '@/repositories';
import { bookingRepository } from '@/repositories/bookings-repository';

async function getUserBooking(userId: number) {
  const result = await bookingRepository.getByUserId(userId);
  if (!result) throw notFoundError();
  delete result.userId;
  delete result.createdAt;
  delete result.updatedAt;
  delete result.roomId;
  return result;
}

async function createBooking(roomId: number, userId: number) {
  const room = await bookingRepository.roomIdExists(roomId);
  if (!room) throw notFoundError();
  if (room.Booking.length >= room.capacity) throw forbiddenError();
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw forbiddenError();
  const ticket = await ticketsRepository.findTicketById(userId);

  if (!ticket) throw forbiddenError();
  if (!ticket.TicketType) throw forbiddenError();
  if (ticket.TicketType.isRemote) throw forbiddenError();
  if (ticket.TicketType.includesHotel == false) throw forbiddenError();
  if (ticket.status !== 'PAID') throw forbiddenError();

  const result = await bookingRepository.createBooking(userId, roomId);
  const response = { bookingId: result.id };
  return response;
}

async function updateBooking(roomId: number, bookingId: number | string | undefined | null, userId: number) {
  if (isNaN(Number(bookingId)) || bookingId == '0') throw notFoundError();
  const room = await bookingRepository.roomIdExists(roomId);
  if (!room) throw notFoundError();
  const booking = await bookingRepository.getByUserId(userId);

  if (!booking) throw forbiddenError();
  if (room.Booking.length >= room.capacity) throw forbiddenError();

  const result = await bookingRepository.updateBooking(Number(bookingId), roomId);
  const response = { bookingId: result.id };
  return response;
}

export const bookingService = {
  getUserBooking,
  createBooking,
  updateBooking,
};
