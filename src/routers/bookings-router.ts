import { Router } from 'express';
import { authenticateToken, validateBody } from '@/middlewares';
import bookingController from '@/controllers/bookings-controller';
import { bookingSchema } from '@/schemas/booking-schema';

const bookingsRouter = Router();

bookingsRouter
    .all("/*", authenticateToken)
    .get('/', bookingController.getBooking)
    .post('/', validateBody(bookingSchema), bookingController.createBooking)
    .put('/:bookingId', validateBody(bookingSchema), bookingController.updateBooking)

export { bookingsRouter };