
import joi from 'joi';
import { Types } from 'mongoose';
import { generalFiled } from '../../utils/generalFields.js';




export const createReview = {
    body: joi.object({
        comment: joi.string().min(3).required(),
        rate: joi.number().min(1).max(5).integer().required(),
    }).required(),
    params: joi.object({
        productId: generalFiled.id.required(),
    }).required(),

    headers: generalFiled.headers.required()
}

export const updateReview = {
    body: joi.object({
        code: joi.string().min(3),
        amount: joi.number().min(1).max(100).integer(),
        fromDate: joi.date().greater(Date.now()),
        toDate: joi.date().greater(joi.ref('fromDate'))
    }).required(),

    headers: generalFiled.headers.required()
}