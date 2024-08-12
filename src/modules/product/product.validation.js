
import joi from 'joi';
import { Types } from 'mongoose';
import { generalFiled } from '../../utils/generalFields.js';



export const createProduct = {
    body: joi.object({
        title: joi.string().min(3).max(32).required(),
        description: joi.string().required(),
        category: generalFiled.id.required(),
        subCategory: generalFiled.id.required(),
        brand: generalFiled.id.required(),
        price: joi.number().integer().required(),
        discount: joi.number().integer().min(1).max(100).required(),
        stock: joi.number().integer().required()
    }).required(),
    files: joi.object({
        image: joi.array().items(generalFiled.file.required()).max(1).required(),
        coverImages: joi.array().items(generalFiled.file.required()).max(3).required(),
    }).required(),
    headers: generalFiled.headers.required()
}


export const updateProduct = {
    body: joi.object({
        title: joi.string().min(3).max(32),
        description: joi.string(),
        category: generalFiled.id.required(),
        subCategory: generalFiled.id.required(),
        brand: generalFiled.id.required(),
        price: joi.number().integer(),
        discount: joi.number().integer().min(1).max(100),
        stock: joi.number().integer()
    }).required(),
    files: joi.object({
        image: joi.array().items(generalFiled.file).max(1),
        coverImages: joi.array().items(generalFiled.file).max(3),
    }),
    params: joi.object({
        id:  generalFiled.id.required(),
    }),
    headers: generalFiled.headers.required()
}