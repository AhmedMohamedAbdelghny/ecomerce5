
import joi from 'joi';
import { Types } from 'mongoose';
import { generalFiled } from '../../utils/generalFields.js';



export const createSubCategory = {
    body: joi.object({
        name: joi.string().min(3).max(32).required(),
        // category: generalFiled.id.required()
    }).required(),

    headers: generalFiled.headers.required()
}