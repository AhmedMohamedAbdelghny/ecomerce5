
import joi from 'joi';
import { Types } from 'mongoose';
import { generalFiled } from '../../utils/generalFields.js';




export const createOrder = {
    body: joi.object({
        productId: generalFiled.id,
        quantity: joi.number().integer(),
        address: joi.string().required(),
        phone: joi.string().required(),
        paymentMethod: joi.string().valid("cash", "card").required(),
        couponCode: joi.string().min(3),
    }).required(),

    headers: generalFiled.headers.required()
}


export const cancelOrder = {

    body: joi.object({
        reason: joi.string().required(),
    }).required(),
    params: joi.object({
        id: generalFiled.id.required(),
    }).required(),
    headers: generalFiled.headers.required()
}

