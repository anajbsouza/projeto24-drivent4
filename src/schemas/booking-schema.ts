import Joi from "joi";
import { InputRoomBody } from "@/protocols";

export const bookingSchema = Joi.object<InputRoomBody>({
    roomId: Joi.number().required(),
});