
import joi from 'joi';
import { Types } from 'mongoose';
import { generalFiled } from '../../utils/generalFields.js';




export const createBrand = {
    body: joi.object({
        name: joi.string().min(3).max(32).required(),
    }).required(),

    headers: generalFiled.headers.required()
}