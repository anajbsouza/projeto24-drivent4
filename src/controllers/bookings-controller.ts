import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import { bookingService } from '@/services';


async function getBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const result = await bookingService.getUserBooking(userId);
  return res.status(httpStatus.OK).send(result);
}

async function createBooking(req: AuthenticatedRequest, res: Response) {
  const { roomId } = req.body;
  const result = await bookingService.createBooking(roomId, req.userId);
  return res.status(httpStatus.OK).send(result);
}

async function updateBooking(req: AuthenticatedRequest, res: Response) {
  const { roomId } = req.body;
  const { bookingId } = req.params;
  const result = await bookingService.updateBooking(roomId, bookingId, req.userId);
  res.status(httpStatus.OK).send(result);
}

export const bookingController = {
    getBooking,
    createBooking,
    updateBooking
}