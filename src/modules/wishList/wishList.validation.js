
import joi from 'joi';
import { Types } from 'mongoose';
import { generalFiled } from '../../utils/generalFields.js';




export const createCart = {
    body: joi.object({
        productId: generalFiled.id.required(),
        quantity: joi.number().integer().required(),
    }).required(),

    headers: generalFiled.headers.required()
}

export const removeCart = {
    body: joi.object({
        productId: generalFiled.id.required(),
    }).required(),

    headers: generalFiled.headers.required()
}
export const clearCart = {
    headers: generalFiled.headers.required()
}