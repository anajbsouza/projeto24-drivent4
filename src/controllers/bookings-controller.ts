import { AuthenticatedRequest } from "@/middlewares";
import { bookingService } from "@/services/bookings-service";
import { Response } from "express";
import httpStatus from "http-status";


async function createBooking(req: AuthenticatedRequest, res: Response) {
    try {
        const { userId } = req;
        const { roomId } = req.body;
        const bookingId = await bookingService.createBooking(userId, roomId);
        return res.status(httpStatus.OK).send({ bookingId });
    } catch (error) {
        if (error.name === 'NotFoundError') {
            return res.sendStatus(httpStatus.NOT_FOUND);
        }
        if (error.name === 'ForbiddenError') {
            return res.sendStatus(httpStatus.FORBIDDEN);
        }
        return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
    }
}

async function getBooking(req: AuthenticatedRequest, res: Response) {
    try {
        const { userId } = req;
        const booking = await bookingService.getBooking(userId);
        return res.status(httpStatus.OK).send(booking);
    } catch (error) {
        if (error.name === 'NotFoundError') {
            return res.sendStatus(httpStatus.NOT_FOUND);
        }
        return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
    }
}

async function updateBooking(req: AuthenticatedRequest, res: Response) {
    try {
        const { userId } = req;
        const { roomId } = req.body;
        const { bookingId } = req.params;
        const updatedBookingId = await bookingService.updateBooking(userId, roomId, Number(bookingId));
        return res.status(httpStatus.OK).send({ bookingId: updatedBookingId });
    } catch (error) {
        if (error.name === 'NotFoundError') {
            return res.sendStatus(httpStatus.NOT_FOUND);
        }
        if (error.name === 'ForbiddenError') {
            return res.sendStatus(httpStatus.FORBIDDEN);
        }
        return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
    }
}

const bookingController = {
    createBooking,
    getBooking,
    updateBooking
};
export default bookingController;